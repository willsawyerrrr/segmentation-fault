from controllers.communications import send_comment_notification
from controllers.posts import get_post
from database import db
from fastapi import BackgroundTasks, HTTPException, status
from schemas.comments import Comment, CommentCreate, CommentUpdate
from schemas.votes import VoteType


async def get_comments() -> list[Comment]:
    """
    Get all comments.

    Returns
    -------
        `list[Comment]`: all comments
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Comments")
        return [Comment(**comment) for comment in cursor.fetchall()]


async def get_comment(comment_id: int) -> Comment:
    """
    Get the comment specified by the given ID.

    Parameters
    ----------
        comment_id (`int`): the ID of the comment

    Returns
    -------
        `Comment`: the comment
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Comments WHERE id = %s", (comment_id,))

        if not (comment := cursor.fetchone()):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Comment not found")

        return Comment(**comment)


async def create_comment(
    comment: CommentCreate, background_tasks: BackgroundTasks, user_id: int
) -> Comment:
    """
    Create a new comment.

    Parameters
    ----------
        `comment` (`CommentCreate`): the comment to create
        `background_tasks` (`BackgroundTasks`): the background tasks
        `user_id` (`int`): the ID of the user

    Returns
    -------
        `Comment`: the newly created comment
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            f"INSERT INTO Comments (author, content, post) VALUES (%(author)s, %(content)s, %(post)s)",
            comment.dict() | {"author": user_id},
        )
        db.commit()

        cursor.execute("SELECT * FROM Comments WHERE id = %s", (cursor.lastrowid,))

        background_tasks.add_task(
            send_comment_notification, await get_post(comment.post), user_id
        )

        return Comment(**cursor.fetchone())


async def update_comment(comment_id: int, comment: CommentUpdate) -> Comment:
    """
    Update the comment specified by the given ID.

    Parameters
    ----------
        `comment_id` (`int`): the ID of the comment
        `comment` (`CommentUpdate`): the comment to update to

    Returns
    -------
        `Comment`: the updated comment
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "UPDATE Comments SET content = %s WHERE id = %s",
            (comment.content, comment_id),
        )
        db.commit()

        cursor.execute("SELECT * FROM Comments WHERE id = %s", (comment_id,))
        return Comment(**cursor.fetchone())


async def delete_comment(comment_id: int) -> None:
    """
    Delete the comment specified by the given ID.

    Parameters
    ----------
        `comment_id` (`int`): the ID of the comment
    """
    with db.dict_cursor() as cursor:
        cursor.execute("DELETE FROM Comments WHERE id = %s", (comment_id,))
        db.commit()


async def get_comment_votes(comment_id: int) -> int:
    """
    Get the aggregate vote count of the comment specified by the given ID.

    Parameters
    ----------
        comment_id (`int`): the ID of the comment

    Returns
    -------
        `int`: the aggregate vote count of the comment
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM Votes WHERE parent_comment = %s AND type = 1",
            (comment_id,),
        )
        upvotes = cursor.fetchone()["COUNT(*)"]

        cursor.execute(
            "SELECT COUNT(*) FROM Votes WHERE parent_comment = %s AND type = 0",
            (comment_id,),
        )
        downvotes = cursor.fetchone()["COUNT(*)"]

        return upvotes - downvotes


async def get_comment_vote(comment_id: int, user_id: int) -> VoteType:
    """
    Get the vote on the comment specified by the given ID.

    Parameters
    ----------
        `comment_id` (`int`): the ID of the comment
        `user_id` (`int`): the ID of the user

    Returns
    -------
        `VoteType`: the vote on the comment
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT type FROM Votes WHERE parent_comment = %s AND user = %s",
            (comment_id, user_id),
        )

        if not (vote := cursor.fetchone()):
            return VoteType.NULL

        return VoteType.UP if vote["type"] else VoteType.DOWN


async def create_comment_vote(comment_id: int, type: VoteType, user_id: int):
    """
    Create a new vote on the comment specified by the given ID.

    Parameters
    ----------
        `comment_id` (`int`): the ID of the comment
        `type` (`VoteType`): the type of vote to create
        `user_id` (`int`): the ID of the user
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "DELETE FROM Votes WHERE parent_comment = %s AND user = %s",
            (comment_id, user_id),
        )

        if type != VoteType.NULL:
            cursor.execute(
                "INSERT INTO Votes (parent_comment, user, type) VALUES (%s, %s, %s)",
                (comment_id, user_id, 1 if type == VoteType.UP else 0),
            )

        db.commit()
