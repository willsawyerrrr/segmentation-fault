import controllers.posts as controller
from controllers.auth import get_current_user
from fastapi import APIRouter, Depends, status
from schemas.comments import Comment
from schemas.posts import Post, PostCreate, PostUpdate
from schemas.users import User
from schemas.votes import VoteType

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[Post])
async def get_posts():
    return await controller.get_posts()


@router.get("/{post_id}", response_model=Post)
async def get_post(post_id: int):
    return await controller.get_post(post_id)


@router.get("/{post_id}/comments", response_model=list[Comment])
async def get_post_comments(post_id: int):
    return await controller.get_post_comments(post_id)


@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate, user: User = Depends(get_current_user)):
    return await controller.create_post(post, user.id)


@router.put("/{post_id}", response_model=Post)
async def update_post(post_id: int, post: PostUpdate):
    return await controller.update_post(post_id, post)


@router.delete("/{post_id}")
async def delete_post(post_id: int):
    return await controller.delete_post(post_id)


@router.get("/{post_id}/votes", response_model=int)
async def get_post_votes(post_id: int):
    return await controller.get_post_votes(post_id)


@router.get("/{post_id}/vote")
async def get_post_vote(post_id: int, user: User = Depends(get_current_user)):
    return await controller.get_post_vote(post_id, user.id)


@router.post("/{post_id}/vote", status_code=status.HTTP_201_CREATED)
async def create_post_vote(
    post_id: int, type: VoteType, user: User = Depends(get_current_user)
):
    return await controller.create_post_vote(post_id, type, user.id)
