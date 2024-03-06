# Standard
import logging

# Third Party
from fastapi import APIRouter

# Places Code
from places.service.recipes.manager import get_manager as get_recipes_manager
from places.service.recipes.models import (
    RecipeModel,
    Instruction,
    Ingredient,
    Note,
)

# Constants
recipes_manager = get_recipes_manager()

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/recipes/add")
def add_recipe(recipe: RecipeModel) -> RecipeModel:
    """Add a recipe to the database.

    Args:
        recipe (RecipeModel): Recipe to add to the database
    """
    logger.info(f"Adding recipe {recipe.name}")
    return recipes_manager.add_recipe(recipe=recipe)


@router.post("/instruction/add")
def add_instruction(recipe_id: str, instruction: Instruction) -> Instruction:
    """Add an instruction to the database.

    Args:
        instruction (Instruction): Instruction to add to the database
    """
    logger.info(f"Adding instruction {instruction}")
    return recipes_manager.add_instruction(recipe_id=recipe_id, instruction=instruction)


@router.post("/ingredient/add")
def add_ingredient(recipe_id: str, ingredient: Ingredient) -> Ingredient:
    """Add an ingredient to the database.

    Args:
        ingredient (Ingredient): Ingredient to add to the database
    """
    logger.info(f"Adding ingredient {ingredient}")
    return recipes_manager.add_ingredient(recipe_id=recipe_id, ingredient=ingredient)


@router.post("/note/add")
def add_note(recipe_id: str, note: Note) -> Note:
    """Add a note to the database.

    Args:
        note (Note): Note to add to the database
    """
    logger.info(f"Adding note {note}")
    return recipes_manager.add_note(recipe_id=recipe_id, note=note)
