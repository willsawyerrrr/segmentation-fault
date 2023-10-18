from enum import Enum

from pydantic import BaseModel


class VoteType(str, Enum):
    UP = "true"
    DOWN = "false"
    NULL = "null"


class VoteBase(BaseModel):
    id: int
    user: int
    type: VoteType
    parent_comment: int
    parent_post: int


class VoteCreate(BaseModel):
    type: VoteType
    parent_comment: int
    parent_post: int
