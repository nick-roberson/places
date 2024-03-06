# Standard
import logging

# Third Party
from fastapi import APIRouter

# Places Code
from places.service.recipes.manager import get_manager as get_recipes_manager
from places.service.recipes.models import (
    RecipeModel,
    Ingredient,
    Instruction,
    Note,
)

# Constants
recipes_manager = get_recipes_manager()

router = APIRouter()
logger = logging.getLogger(__name__)


@router.put("/recipes/update")
def update_recipe(recipe: RecipeModel) -> RecipeModel:
    """Update a recipe in the database.

    Args:
        recipe (RecipeModel): Recipe to update in the database
    """
    logger.info(f"Updating recipe {recipe.name}")
    return recipes_manager.update_recipe(recipe=recipe)


@router.put("/instruction/update")
def update_instruction(recipe_id: str, instruction: Instruction) -> Instruction:
    """Update an instruction in the database.

    Args:
        instruction (Instruction): Instruction to update in the database
    """
    logger.info(f"Updating instruction {instruction}")
    return recipes_manager.update_instruction(
        recipe_id=recipe_id, instruction=instruction
    )


@router.put("/ingredient/update")
def update_ingredient(recipe_id: str, ingredient: Ingredient) -> Ingredient:
    """Update an ingredient in the database.

    Args:
        ingredient (Ingredient): Ingredient to update in the database
    """
    logger.info(f"Updating ingredient {ingredient}")
    return recipes_manager.update_ingredient(recipe_id=recipe_id, ingredient=ingredient)


@router.put("/note/update")
def update_note(recipe_id: str, note: Note) -> Note:
    """Update a note in the database.

    Args:
        note (Note): Note to update in the database
    """
    logger.info(f"Updating note {note}")
    return recipes_manager.update_note(recipe_id=recipe_id, note=note)
