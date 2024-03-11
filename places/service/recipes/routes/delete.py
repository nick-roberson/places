# Standard
import logging

# Third Party
from fastapi import APIRouter

# Places Code
from places.service.recipes.manager import get_manager as get_recipes_manager

# Constants
recipes_manager = get_recipes_manager()

router = APIRouter()
logger = logging.getLogger(__name__)


@router.delete("/recipes/delete")
def delete_recipe(recipe_id: str) -> None:
    """Delete a recipe from the database.

    Args:
        recipe_id (str): Recipe id to delete
    """
    print(f"Deleting recipe {recipe_id}")
    return recipes_manager.delete_recipe_by_id(recipe_id=recipe_id)


@router.delete("/instruction/delete")
def delete_instruction(recipe_id: str, instruction_id: str) -> None:
    """Delete an instruction from the database.

    Args:
        recipe_id (str): Recipe id to delete the instruction from
        instruction (Instruction): Instruction to delete from the database
    """
    print(f"Deleting instruction {recipe_id=} {instruction_id=}")
    return recipes_manager.delete_instruction_by_id(
        recipe_id=recipe_id, instruction_id=instruction_id
    )


@router.delete("/ingredient/delete")
def delete_ingredient(recipe_id: str, ingredient_id: str) -> None:
    """Delete an ingredient from the database.

    Args:
        recipe_id (str): Recipe id to delete the ingredient from
        ingredient (Ingredient): Ingredient to delete from the database
    """
    print(f"Deleting ingredient {recipe_id=} {ingredient_id=}")
    return recipes_manager.delete_ingredient_by_id(
        recipe_id=recipe_id, ingredient_id=ingredient_id
    )


@router.delete("/note/delete")
def delete_note(recipe_id: str, note_id: str) -> None:
    """Delete a note from the database.

    Args:
        recipe_id (str): Recipe id to delete the note from
        note (Note): Note to delete from the database
    """
    print(f"Deleting note {recipe_id=} {note_id=}")
    return recipes_manager.delete_note_by_id(recipe_id=recipe_id, note_id=note_id)
