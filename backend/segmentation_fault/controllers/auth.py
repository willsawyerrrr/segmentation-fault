import datetime
import re
import string
from os import getenv

import bcrypt
from controllers.communications import send_password_reset_email, send_welcome_email
from controllers.tokens import create_token
from controllers.users import create_user
from database import db
from fastapi import BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from schemas.auth import AuthToken, ForgotPassword, LoginForm, ResetPassword
from schemas.tokens import Token, TokenType
from schemas.users import User, UserCreate

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="auth/login")
""" The OAuth2 scheme used to authenticate users. """

SECRET_KEY = getenv("SECRET_KEY")
""" The secret key used to sign JWTs. """

ALGORITHM = getenv("ALGORITHM")
""" The algorithm used to sign JWTs. """

ACCESS_TOKEN_TTL = int(getenv("ACCESS_TOKEN_TTL", 0))
""" The number of minutes after which an access token expires. """

BACKGROUND_TASKS = BackgroundTasks()
""" Background tasks. """


async def login(credentials: LoginForm) -> AuthToken:
    """
    Authenticates a user.

    Parameters
    ----------
        `credentials` (`LoginForm`): the user's credentials

    Raises
    ------
        `HTTPException`: if the user does not exist or the password is incorrect

    Returns
    -------
        `Token`: access token
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Users WHERE username = %s", (credentials.username,)
        )
        if (
            not (user := cursor.fetchone())
            or not (user := User(**user))
            or not bcrypt.checkpw(credentials.password.encode(), user.password.encode())
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

    access_token = jwt.encode(
        {
            "sub": user.username,
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(minutes=ACCESS_TOKEN_TTL),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return {"access_token": access_token, "token_type": "bearer"}


async def sign_up(user: UserCreate, background_tasks: BackgroundTasks) -> User:
    """
    Registers a new user.

    Parameters
    ----------
        `user` (`UserCreate`): the user's details
        `background_tasks` (`BackgroundTasks`): background tasks

    Raises
    ------
        `HTTPException`: if a user with the given username or email already exists

    Returns
    -------
        `User`: the new user
    """
    if not validate_password(user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password",
        )

    created_user = await create_user(user)

    token = await create_token(created_user.id, TokenType.EMAIL_VERIFICATION)

    background_tasks.add_task(send_welcome_email, created_user, token.token)

    return created_user


async def verify_email(token: str):
    """
    Verifies a user's email.

    Parameters
    ----------
        `user` (`User`): the user
        `token` (`str`): the verification token
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Tokens WHERE token = %s AND type = %s",
            (token, TokenType.EMAIL_VERIFICATION.value),
        )
        if not (token := cursor.fetchone()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token",
            )

        token = Token(**token)

        cursor.execute(
            "UPDATE Users SET verified = 1 WHERE id = %s",
            (token.user,),
        )
        cursor.execute("DELETE FROM Tokens WHERE token = %s", (token.token,))
        db.commit()


async def forgot_password(
    form_data: ForgotPassword, background_tasks: BackgroundTasks
) -> None:
    """
    Generates a password reset token and sends it to the user's email.

    Parameters
    ----------
        `form_data` (`ForgotPassword`): the user's email
        `background_tasks` (`BackgroundTasks`): background tasks
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Users WHERE email = %s",
            (form_data.email,),
        )
        if not (user := cursor.fetchone()):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="There is no user with this email",
            )

        user = User(**user)

        cursor.execute(
            "DELETE FROM Tokens WHERE user = %s AND type = %s",
            (user.id, TokenType.PASSWORD_RESET),
        )
        db.commit()

    token = await create_token(user.id, TokenType.PASSWORD_RESET)

    background_tasks.add_task(send_password_reset_email, user, token.token)


async def reset_password(form_data: ResetPassword) -> None:
    """
    Resets a user's password.

    Parameters
    ----------
        `form_data` (`ResetPassword`): the reset token and the new password
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Tokens WHERE token = %s AND type = %s",
            (form_data.token, TokenType.PASSWORD_RESET),
        )
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token",
            )

        if not validate_password(form_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password",
            )

        cursor.execute(
            "UPDATE Users SET password = %s WHERE email = %s",
            (
                bcrypt.hashpw(form_data.password.encode(), bcrypt.gensalt()).decode(),
                form_data.email,
            ),
        )
        cursor.execute("DELETE FROM Tokens WHERE token = %s", (form_data.token,))
        db.commit()


async def get_current_user(token: str = Depends(OAUTH2_SCHEME)) -> User:
    """
    Returns the current user.

    Returns
    -------
        `User`: the current user
    """
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = decoded_token.get("sub")

    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
        if not (user := cursor.fetchone()):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

    return User(**user)


def validate_password(password: str) -> bool:
    """
    Returns whether the given string is a valid password.

    A valid password must:
        - Be at least 8 characters long
        - Contain at least one uppercase letter   (string.ascii_uppercase)
        - Contain at least one lowercase letter   (string.ascii_lowercase)
        - Contain at least one special character  (string.punctuation)
        - Contain at least one number             (string.digits)

    Parameters
    ----------
        `password` (`str`): string to validate as a password

    Returns
    -------
        `bool`: whether the string is a valid password
    """

    # Query to validate password
    # ^                                     Start of string
    # (?=.*[{string.ascii_uppercase}])      At least one uppercase letter
    # (?=.*[{string.ascii_lowercase}])      At least one lowercase letter
    # (?=.*[{string.punctuation}])          At least one special character
    # (?=.*[{string.digits}])               At least one number
    # .{8,}                                 At least 8 characters long
    # $                                     End of string
    query = f"^(?=.*[{string.ascii_uppercase}])(?=.*[{string.ascii_lowercase}])(?=.*[{string.punctuation}])(?=.*[{string.digits}]).{{8,}}$"

    if not (match := re.search(query, password)):  # matches part of the string
        return False

    return match.group(0) == password  # matches the whole string
