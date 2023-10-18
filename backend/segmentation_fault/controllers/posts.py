from database import db
from fastapi import HTTPException, status
from schemas.comments import Comment
from schemas.posts import Post, PostCreate, PostUpdate
from schemas.votes import VoteType


async def get_posts() -> list[Post]:
    """
    Get all posts.

    Returns
    -------
        `list[Post]`: all posts
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Posts ORDER BY created DESC")
        return [Post(**post) for post in cursor.fetchall()]


async def get_post(post_id: int) -> Post:
    """
    Get the post specified by the given ID.

    Parameters
    ----------
        post_id (`int`): the ID of the post

    Returns
    -------
        `Post`: the post
    """
    with db.dict_cursor() as cursor:
        cursor.execute("SELECT * FROM Posts WHERE id = %s", (post_id,))

        if not (post := cursor.fetchone()):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Post not found")

        return Post(**post)


async def get_post_comments(post_id: int) -> list[Comment]:
    """
    Get the top-level comments on the post specified by the given ID.

    Parameters
    ----------
        post_id (`int`): the ID of the post

    Returns
    -------
        `list[Comment]`: the top-level comments on the post
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Comments WHERE post = %s ORDER BY created DESC", (post_id,)
        )
        return [Comment(**comment) for comment in cursor.fetchall()]


async def create_post(post: PostCreate, user_id: int) -> Post:
    """
    Create a new post.

    Parameters
    ----------
        `post` (`PostCreate`): the post to create
        `user_id` (`int`): the ID of the user

    Returns
    -------
        `Post`: the newly created post
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "INSERT INTO Posts (content, title, author) VALUES (%s, %s, %s)",
            (post.content, post.title, user_id),
        )
        db.commit()

        cursor.execute("SELECT * FROM Posts WHERE id = %s", (cursor.lastrowid,))
        return Post(**cursor.fetchone())


async def update_post(post_id: int, post: PostUpdate) -> Post:
    """
    Update the post specified by the given ID.

    Parameters
    ----------
        `post_id` (`int`): the ID of the post

    Returns
    -------
        `Post`: the updated post
    """
    query = "UPDATE Posts SET "
    query += ", ".join(
        [
            f"{key} = %({key})s"
            for key, value in post.dict().items()
            if value is not None
        ]
    )
    query += " WHERE id = %(id)s"

    with db.dict_cursor() as cursor:
        cursor.execute(query, post.dict() | {"id": post_id})
        db.commit()

        cursor.execute("SELECT * FROM Posts WHERE id = %s", (post_id,))
        return Post(**cursor.fetchone())


async def delete_post(post_id: int) -> None:
    """
    Delete the post specified by the given ID.

    Parameters
    ----------
        `post_id` (`int`): the ID of the post
    """
    with db.dict_cursor() as cursor:
        cursor.execute("DELETE FROM Posts WHERE id = %s", (post_id,))
        db.commit()


async def get_post_votes(post_id: int) -> int:
    """
    Get the aggregate vote count of the post specified by the given ID.

    Parameters
    ----------
        post_id (`int`): the ID of the post

    Returns
    -------
        `int`: the aggregate vote count of the post
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM Votes WHERE parent_post = %s AND type = 1",
            (post_id,),
        )
        upvotes = cursor.fetchone()["COUNT(*)"]

        cursor.execute(
            "SELECT COUNT(*) FROM Votes WHERE parent_post = %s AND type = 0",
            (post_id,),
        )
        downvotes = cursor.fetchone()["COUNT(*)"]

        return upvotes - downvotes


async def get_post_vote(post_id: int, user_id: int) -> VoteType:
    """
    Get the vote on the post specified by the given ID.

    Parameters
    ----------
        `post_id` (`int`): the ID of the post
        `user_id` (`int`): the ID of the user

    Returns
    -------
        `VoteType`: the vote on the post
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "SELECT type FROM Votes WHERE parent_post = %s AND user = %s",
            (post_id, user_id),
        )

        if not (vote := cursor.fetchone()):
            return VoteType.NULL

        return VoteType.UP if vote["type"] else VoteType.DOWN


async def create_post_vote(post_id: int, type: VoteType, user_id: int):
    """
    Create a new vote on the post specified by the given ID.

    Parameters
    ----------
        `post_id` (`int`): the ID of the post
        `type` (`VoteType`): the type of vote to create
        `user_id` (`int`): the ID of the user
    """
    with db.dict_cursor() as cursor:
        cursor.execute(
            "DELETE FROM Votes WHERE parent_post = %s AND user = %s",
            (post_id, user_id),
        )

        if type != VoteType.NULL:
            cursor.execute(
                "INSERT INTO Votes (parent_post, user, type) VALUES (%s, %s, %s)",
                (post_id, user_id, 1 if type == VoteType.UP else 0),
            )

        db.commit()
