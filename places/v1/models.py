from pydantic import BaseModel
from typing import List, Optional


class User(BaseModel):
    # global user id, links to comments, recipes, etc.
    id: Optional[int] = None
    # basic user info
    username: str
    email: str
    full_name: str
    disabled: Optional[bool] = None
    # where they may work, links to business.id
    businees_id: Optional[str] = None


class Business(BaseModel):
    # basic business info
    id: Optional[int] = None
    # global business id, links to users, recipes, comments, etc.
    name: str
    address: str
    phone: str
    email: str
    website: str
    # links to users, recipes, comments, etc.
    disabled: Optional[bool] = None


class Recipe(BaseModel):
    # global recipe id, links to comments, etc.
    id: Optional[int] = None
    # basic recipe info
    name: str
    description: str
    ingredients: List[str]
    instructions: List[str]
    disabled: Optional[bool] = None


class Comment(BaseModel):
    # global comment id, links to recipes, users, etc.
    id: Optional[int] = None
    # basic comment info
    text: str
    disabled: Optional[bool] = None
    user_id: Optional[int] = None
    recipe_id: Optional[int] = None
    business_id: Optional[int] = None
    date: str
    time: str
    datetime: str
    rating: Optional[int] = None
    comment: Optional[str] = None
    reply_to: Optional[int] = None
    reply_count: Optional[int] = None
    reply_ids: Optional[List[int]] = None
