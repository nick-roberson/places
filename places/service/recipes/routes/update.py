# Standard
import logging

# Third Party
from fastapi import APIRouter
from typing import List

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


def get_recipe_maybe(recipe_id: str) -> RecipeModel:
    """Get a recipe from the database or raise an error.

    Args:
        recipe_id (str): Recipe id to get from the database
    """
    recipe = recipes_manager.get(recipe_id=recipe_id)
    if not recipe:
        raise ValueError(f"Could not find recipe by id '{recipe_id}'")
    return recipe


@router.put("/recipes/update")
def update_recipe(recipe: RecipeModel) -> RecipeModel:
    """Update a recipe in the database.

    Args:
        recipe (RecipeModel): Recipe to update in the database
    """
    print(f"Updating recipe {recipe.name}")
    return recipes_manager.update_recipe(recipe=recipe)


@router.put("/instruction/update")
def update_instruction(recipe_id: str, instruction: Instruction) -> Instruction:
    """Update an instruction in the database.

    Args:
        instruction (Instruction): Instruction to update in the database
    """
    print(f"Updating instruction {instruction}")
    return recipes_manager.update_instruction(
        recipe=get_recipe_maybe(recipe_id=recipe_id), instruction=instruction
    )


@router.put("/instruction/update/many")
def update_instructions(
    recipe_id: str, instructions: List[Instruction]
) -> List[Instruction]:
    """Update a list of instructions in the database.

    Args:
        instructions (List[Instruction]): Instructions to update in the database
    """
    print(f"Updating {len(instructions)} instructions")
    return recipes_manager.update_instrucitons(
        recipe=get_recipe_maybe(recipe_id=recipe_id), instructions=instructions
    )


@router.put("/ingredient/update")
def update_ingredient(recipe_id: str, ingredient: Ingredient) -> Ingredient:
    """Update an ingredient in the database.

    Args:
        ingredient (Ingredient): Ingredient to update in the database
    """
    print(f"Updating ingredient {ingredient}")
    return recipes_manager.update_ingredient(
        recipe=get_recipe_maybe(recipe_id=recipe_id), ingredient=ingredient
    )


@router.put("/ingredient/update/many")
def update_ingredients(
    recipe_id: str, ingredients: List[Ingredient]
) -> List[Ingredient]:
    """Update a list of ingredients in the database.

    Args:
        ingredients (List[Ingredient]): Ingredients to update in the database
    """
    print(f"Updating {len(ingredients)} ingredients")
    return recipes_manager.update_ingredients(
        recipe=get_recipe_maybe(recipe_id=recipe_id), ingredients=ingredients
    )


@router.put("/note/update")
def update_note(recipe_id: str, note: Note) -> Note:
    """Update a note in the database.

    Args:
        note (Note): Note to update in the database
    """
    print(f"Updating note {note}")
    return recipes_manager.update_note(
        recipe=get_recipe_maybe(recipe_id=recipe_id), note=note
    )


@router.put("/note/update/many")
def update_notes(recipe_id: str, notes: List[Note]) -> List[Note]:
    """Update a list of notes in the database.

    Args:
        notes (List[Note]): Notes to update in the database
    """
    print(f"Updating {len(notes)} notes")
    return recipes_manager.update_notes(
        recipe=get_recipe_maybe(recipe_id=recipe_id), notes=notes
    )
