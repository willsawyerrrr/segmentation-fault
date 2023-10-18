import controllers.users as controller
from controllers.auth import get_current_user
from fastapi import APIRouter, Depends, File, status
from schemas.users import User, UserCreate, UserUpdate

router = APIRouter()


@router.get(
    "/",
    response_model=list[User],
    response_model_exclude={"password"},
    dependencies=[Depends(get_current_user)],
)
async def get_users():
    return await controller.get_users()


@router.get(
    "/{user_id}",
    response_model=User,
    response_model_exclude={"password"},
    dependencies=[Depends(get_current_user)],
)
async def get_user(user_id: int):
    return await controller.get_user(user_id)


@router.post(
    "/",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
    response_model_exclude={"password"},
)
async def create_user(user: UserCreate):
    return await controller.create_user(user)


@router.put(
    "/{user_id}",
    response_model=User,
    response_model_exclude={"password"},
    dependencies=[Depends(get_current_user)],
)
async def update_user(user_id: int, user: UserUpdate):
    return await controller.update_user(user_id, user)


@router.delete("/{user_id}", dependencies=[Depends(get_current_user)])
async def delete_user(user_id: int):
    return await controller.delete_user(user_id)


@router.get("/{user_id}/image")
async def get_user_image(user_id: int):
    return await controller.get_user_image(user_id)


@router.post("/{user_id}/image", dependencies=[Depends(get_current_user)])
async def upload_user_image(user_id: int, image: bytes = File()):
    return await controller.upload_user_image(user_id, image)
