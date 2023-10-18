import io

import bcrypt
from database import db
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse
from PIL import Image
from schemas.users import User, UserCreate, UserUpdate

IMAGE_SIZE = 48
""" The size for images to be cropped to. """

IMAGE_RADIUS = IMAGE_SIZE // 2
""" The "radius" to crop images to. """


async def get_users() -> list[User]:
    """
    Get all users.

    Returns
    -------
        `list[User]`: all users
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Users")
        users = cursor.fetchall()
        return [User(**user) for user in users]


async def get_user(user_id: int) -> User:
    """
    Get the user specified by the given ID.

    Parameters
    ----------
        user_id (`int`): the ID of the user

    Returns
    -------
        `User`: the user
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Users WHERE id = %s", (user_id,))

        if not (user := cursor.fetchone()):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

        return User(**user)


async def create_user(user: UserCreate) -> User:
    """
    Create a new user.

    Parameters
    ----------
        `user` (`UserCreate`): the user to create

    Returns
    -------
        `User`: the newly created user
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "INSERT INTO Users (username, email, password, first_name, last_name) VALUES (%(username)s, %(email)s, %(password)s, %(first_name)s, %(last_name)s)",
            user.dict()
            | {
                "password": bcrypt.hashpw(
                    user.password.encode(), bcrypt.gensalt()
                ).decode()
            },
        )
        db.commit()

        cursor.execute("SELECT * FROM Users WHERE id = %s", (cursor.lastrowid,))
        return User(**cursor.fetchone())


async def update_user(user_id: int, user: UserUpdate) -> User:
    """
    Update the user specified by the given ID.

    Parameters
    ----------
        `user_id` (`int`): the ID of the user
        `user` (`UserUpdate`): the user to update to

    Returns
    -------
        `User`: the updated user
    """
    query = "UPDATE Users SET "
    query += ", ".join(
        [
            f"{key} = %({key})s"
            for key, value in user.dict().items()
            if value is not None
        ]
    )
    query += " WHERE id = %(id)s"

    with db.dict_cursor() as cursor:
        cursor.execute(query, user.dict() | {"id": user_id})
        db.commit()

        cursor.execute("SELECT * FROM Users WHERE id = %s", (user_id,))
        return User(**cursor.fetchone())


async def delete_user(user_id: int) -> None:
    """
    Delete the user specified by the given ID.

    Parameters
    ----------
        `user_id` (`int`): the ID of the user
    """
    with db.dict_cursor() as cursor:
        cursor.execute("DELETE FROM Users WHERE id = %s", (user_id,))
        db.commit()


async def get_user_image(user_id: int) -> bytes:
    """
    Get the profile image of the user specified by the given ID.

    Parameters
    ----------
        `user_id` (`int`): the ID of the user

    Returns
    -------
        `StreamingResponse`: the user's profile image
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT image FROM Users WHERE id = %s", (user_id,))

        if not (raw_image := cursor.fetchone()):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

        image = Image.frombytes("RGB", (IMAGE_SIZE, IMAGE_SIZE), raw_image["image"])

        result = io.BytesIO()
        image.save(result, "JPEG")
        result.seek(0)

        return StreamingResponse(result, media_type="image/jpeg")


async def upload_user_image(user_id: int, raw_image: bytes):
    """
    Upload an image for the user specified by the given ID.

    Parameters
    ----------
        `user_id` (`int`): the ID of the user
        `raw_image` (`bytes`): the image to upload
    """
    image = Image.open(io.BytesIO(raw_image))
    width, height = image.size

    image = image.reduce(min(width // IMAGE_SIZE, height // IMAGE_SIZE))
    width, height = image.size

    if width >= height:
        center = width // 2
        image = image.crop((center - IMAGE_RADIUS, 0, center + IMAGE_RADIUS, height))
    else:
        center = height // 2
        image = image.crop((0, center - IMAGE_RADIUS, width, center + IMAGE_RADIUS))

    with db.dict_cursor() as cursor:
        cursor.execute(
            "UPDATE Users SET image = %s WHERE id = %s", (image.tobytes(), user_id)
        )
        db.commit()

        return cursor.lastrowid is not None
