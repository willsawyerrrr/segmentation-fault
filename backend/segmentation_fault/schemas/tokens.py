from enum import Enum

from pydantic import BaseModel


class TokenType(Enum):
    EMAIL_VERIFICATION = 0
    PASSWORD_RESET = 1


class Token(BaseModel):
    token: str
    user: int
    type: TokenType
