# Standard
import logging
import uuid
import datetime

# Third Party
from fastapi import APIRouter
from fastapi import HTTPException
from typing import List

# Places Code
from places.service.recipes.manager import get_manager as get_recipes_manager
from places.service.recipes.models import (
    RecipeModel,
    RecipesModel,
)

# Constants
recipes_manager = get_recipes_manager()

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/recipes/all")
def get_all() -> RecipesModel:
    """Get all recipes from the database.

    Args:
        recipe (RecipeModel): Recipe to add to the database
    """
    logger.info(f"Getting all recipes")
    return recipes_manager.get_all()
