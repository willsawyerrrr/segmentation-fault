from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    id: int
    created: datetime
    updated: Optional[datetime]
    username: str
    email: str
    password: str
    super: bool
    first_name: str
    last_name: str
    verified: bool


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str


class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
