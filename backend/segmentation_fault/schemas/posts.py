from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Post(BaseModel):
    id: int
    created: datetime
    updated: Optional[datetime]
    author: int
    title: str
    content: str


class PostCreate(BaseModel):
    title: str
    content: str


class PostUpdate(BaseModel):
    title: str
    content: str
