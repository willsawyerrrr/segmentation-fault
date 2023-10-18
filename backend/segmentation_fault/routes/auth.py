import controllers.auth as controller
from fastapi import APIRouter, BackgroundTasks, Depends, status
from schemas.auth import AuthToken, ForgotPassword, LoginForm, ResetPassword
from schemas.users import User, UserCreate

router = APIRouter()


@router.post("/login", response_model=AuthToken, status_code=status.HTTP_200_OK)
async def login(form_data: LoginForm = Depends()):
    return await controller.login(form_data)


@router.post("/sign-up", response_model=User, status_code=status.HTTP_201_CREATED)
async def sign_up(user: UserCreate, background_tasks: BackgroundTasks):
    return await controller.sign_up(user, background_tasks)


@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(token: str):
    return await controller.verify_email(token)


@router.post("/forgot-password", status_code=status.HTTP_201_CREATED)
async def forgot_password(form_data: ForgotPassword, background_tasks: BackgroundTasks):
    return await controller.forgot_password(form_data, background_tasks)


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(form_data: ResetPassword):
    return await controller.reset_password(form_data)


@router.get(
    "/",
    response_model=User,
    response_model_exclude={"password"},
    status_code=status.HTTP_200_OK,
)
async def get_current_user(token: str = Depends(controller.OAUTH2_SCHEME)):
    return await controller.get_current_user(token)
