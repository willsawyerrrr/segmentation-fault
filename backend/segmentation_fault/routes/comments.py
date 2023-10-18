import controllers.comments as controller
from controllers.auth import get_current_user
from dependencies.author import Author
from fastapi import APIRouter, BackgroundTasks, Depends, status
from schemas.comments import Comment, CommentCreate, CommentUpdate
from schemas.users import User
from schemas.votes import VoteType

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[Comment])
async def get_comments():
    return await controller.get_comments()


@router.get("/{comment_id}", response_model=Comment)
async def get_comment(comment_id: int):
    return await controller.get_comment(comment_id)


@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment: CommentCreate,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
):
    return await controller.create_comment(comment, background_tasks, user.id)


@router.put("/{comment_id}", dependencies=[Depends(Author)], response_model=Comment)
async def update_comment(comment_id: int, comment: CommentUpdate):
    return await controller.update_comment(comment_id, comment)


@router.delete("/{comment_id}", dependencies=[Depends(Author)])
async def delete_comment(comment_id: int):
    return await controller.delete_comment(comment_id)


@router.get("/{comment_id}/votes", response_model=int)
async def get_comment_votes(comment_id: int):
    return await controller.get_comment_votes(comment_id)


@router.get("/{comment_id}/vote")
async def get_comment_vote(comment_id: int, user: User = Depends(get_current_user)):
    return await controller.get_comment_vote(comment_id, user.id)


@router.post("/{comment_id}/vote", status_code=status.HTTP_201_CREATED)
async def create_comment_vote(
    comment_id: int, type: VoteType, user: User = Depends(get_current_user)
):
    return await controller.create_comment_vote(comment_id, type, user.id)
