from typing import List, Optional

from pydantic import BaseModel, validator


class Ingredient(BaseModel):
    """Ingredient Model"""

    id: Optional[str] = None

    name: str
    quantity: str
    measurement: str
    preparation: Optional[str] = None

    # allow extra to be passed in
    class Config:
        extra = "allow"


class Instruction(BaseModel):
    """Instruction Model"""

    id: Optional[str] = None

    step: int
    description: str

    @validator("step")
    def ensure_step_is_positive(cls, v):
        v = int(v)
        if v < 1:
            raise ValueError("Step must be greater than 0")
        return v

    # allow extra to be passed in
    class Config:
        extra = "allow"


class Note(BaseModel):
    """Note Model"""

    id: Optional[str] = None

    title: str
    body: str

    # allow extra to be passed in
    class Config:
        extra = "allow"


class RecipeModel(BaseModel):
    """Recipe Model"""

    id: Optional[str] = None

    name: str
    description: str
    source: Optional[str] = None

    ingredients: List[Ingredient] = []
    instructions: List[Instruction] = []
    notes: List[Note] = []


class RecipesModel(BaseModel):
    """Recipes Model"""

    recipes: List[RecipeModel] = []
