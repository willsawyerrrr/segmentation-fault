from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Comment(BaseModel):
    id: int
    created: datetime
    updated: Optional[datetime]
    author: int
    content: str
    post: int


class CommentCreate(BaseModel):
    content: str
    post: int


class CommentUpdate(BaseModel):
    content: str
