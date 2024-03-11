# Standard
import logging

from fastapi import APIRouter

from places.service.recipes.manager import get_manager as get_recipes_manager
from places.service.recipes.models import RecipeModel, RecipesModel

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
    print(f"Getting all recipes")
    return recipes_manager.get_all()


@router.get("/recipes/{recipe_id}")
def get(recipe_id: str) -> RecipeModel:
    """Get a recipe from the database.

    Args:
        recipe_id (str): Recipe id to get from the database
    """
    print(f"Getting recipe {recipe_id}")
    return recipes_manager.get(recipe_id=recipe_id)


@router.get("/recipes/name/{name}")
def get_by_name(name: str) -> RecipesModel:
    """Get a recipe from the database.

    Args:
        recipe_id (str): Recipe id to get from the database
    """
    print(f"Getting recipe {name}")
    return recipes_manager.get_by_name(name=name)
