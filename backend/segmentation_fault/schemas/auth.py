from fastapi import Form
from pydantic import BaseModel


class AuthToken(BaseModel):
    access_token: str
    token_type: str


class LoginForm:
    def __init__(self, username: str = Form(), password: str = Form()):
        """
        This is a dependency class, use it like:

        @app.post("/login")
        def login(form_data: LoginForm = Depends()):
            print(form_data.username)
            print(form_data.password)

        Parameters
        ----------
            `username` (`str`): the username
            `password` (`str`): the password
        """
        self.username = username
        self.password = password


class ForgotPassword(BaseModel):
    email: str


class ResetPassword(BaseModel):
    token: str
    password: str
