from pydantic import BaseModel
from typing import List, Optional
from pydantic import validator
import uuid


class Ingredient(BaseModel):
    """Ingredient Model"""

    id: Optional[str] = None

    name: str
    quantity: str
    measurement: str
    preparation: Optional[str] = None

    @validator("id")
    def ensure_unique_id(cls, v):
        if v == "" or v is None:
            return str(uuid.uuid4())
        return v

    @validator("name")
    def name_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Name cannot be blank")
        return v

    @validator("quantity")
    def quantity_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Quantity cannot be blank")
        return v

    @validator("measurement")
    def measurement_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Measurement cannot be blank")
        return v

    @validator("preparation")
    def preparation_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Preparation cannot be blank")
        return v


class Instruction(BaseModel):
    """Instruction Model"""

    id: Optional[str] = None

    step: int
    description: str

    @validator("id")
    def ensure_unique_id(cls, v):
        if v == "" or v is None:
            return str(uuid.uuid4())
        return v

    @validator("step")
    def step_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Step must be a positive integer")
        return v

    @validator("description")
    def description_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Description cannot be blank")
        return v


class Note(BaseModel):
    """Note Model"""

    id: Optional[str] = None

    title: str
    body: str

    @validator("id")
    def ensure_unique_id(cls, v):
        if v == "" or v is None:
            return str(uuid.uuid4())
        return v

    @validator("title")
    def title_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Title cannot be blank")
        return v

    @validator("body")
    def body_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Body cannot be blank")
        return v


class RecipeModel(BaseModel):
    """Recipe Model"""

    id: Optional[str] = None

    name: str
    description: str
    source: Optional[str] = None

    ingredients: List[Ingredient] = []
    instructions: List[Instruction] = []
    notes: List[Note] = []

    @validator("id")
    def ensure_unique_id(cls, v):
        if v == "" or v is None:
            return str(uuid.uuid4())
        return v

    @validator("name")
    def name_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Name cannot be blank")
        return v

    @validator("description")
    def description_must_not_be_blank(cls, v):
        if v == "":
            raise ValueError("Description cannot be blank")
        return v


class RecipesModel(BaseModel):
    """Recipes Model"""

    recipes: List[RecipeModel] = []
