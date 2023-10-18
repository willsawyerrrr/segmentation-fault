from controllers.auth import get_current_user
from database import db
from fastapi import Depends, HTTPException
from schemas.users import User


class Author:
    def __call__(
        self,
        comment_id: str | None = None,
        post_id: str | None = None,
        user: User = Depends(get_current_user),
    ):
        with db.dict_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM %s WHERE id = %s AND user = %s",
                (
                    "Comments" if comment_id is not None else "Posts",
                    comment_id if comment_id is not None else post_id,
                    user.id,
                ),
            )
            if cursor.fetchone() is None:
                raise HTTPException(
                    status_code=403,
                    detail=f"You are not the author of this {'comment' if comment_id is not None else 'post'}",
                )
