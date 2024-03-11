from typing import List

from pydantic import BaseModel


class CommentInsertModel(BaseModel):
    place_id: str
    text: str


class CommentModel(BaseModel):
    place_id: str
    comment_id: str
    text: str
    created_at: str
    updated_at: str


class CommentsModel(BaseModel):
    comments: List[CommentModel]
