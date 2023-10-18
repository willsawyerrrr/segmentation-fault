from secrets import token_urlsafe

from database import db
from fastapi import HTTPException, status
from schemas.tokens import Token, TokenType


async def create_token(user: int, type: TokenType):
    """
    Creates a token.

    Parameters
    ----------
        `user` (`int`): the ID of the user the token belongs to
        `type` (`TokenType`): the type of the token

    Returns
    -------
        `Token`: the created token
    """
    with db.dict_cursor() as cursor:
        token = token_urlsafe(16)
        cursor.execute(
            "INSERT INTO Tokens (token, user, type) VALUES (%s, %s, %s)",
            (token, user, type.value),
        )
        db.commit()

        cursor.execute("SELECT * FROM Tokens WHERE token = %s", (token,))
        if not (token := cursor.fetchone()):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token creation failed",
            )

        return Token(**token)


async def get_token(token: str):
    """
    Gets a token.

    Raises
    ------
        `HTTPException`: if the token does not exist

    Parameters
    ----------
        `token` (`str`): the token to get
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Tokens WHERE token = %s", (token,))
        if not (token := cursor.fetchone()):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return Token(**cursor.fetchone())


async def delete_token(token: str):
    """
    Deletes a token.

    Raises
    ------
        `HTTPException`: if the token does not exist

    Parameters
    ----------
        `token` (`str`): the token to delete
    """
    with db.dict_cursor() as cursor:
        cursor.execute("DELETE FROM Tokens WHERE token = %s", (token,))
        db.commit()

        if not cursor.lastrowid:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return Token(**cursor.fetchone())
