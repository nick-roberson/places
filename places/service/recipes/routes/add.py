# Standard
import logging
from typing import List

from fastapi import APIRouter

from places.service.recipes.manager import get_manager as get_recipes_manager
from places.service.recipes.models import (Ingredient, Instruction, Note,
                                           RecipeModel)

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
    print(f"Adding recipe {recipe.name}")
    return recipes_manager.add_recipe(recipe=recipe)


@router.post("/recipes/add/many")
def add_recipes(recipes: List[RecipeModel]) -> List[RecipeModel]:
    """Add many recipes to the database.

    Args:
        recipes (List[RecipeModel]): Recipes to add to the database
    """
    print(f"Adding {len(recipes)} recipes")
    return recipes_manager.add_recipes(recipes=recipes)


@router.post("/instruction/add")
def add_instruction(recipe_id: str, instruction: Instruction) -> Instruction:
    """Add an instruction to the database.

    Args:
        instruction (Instruction): Instruction to add to the database
    """
    print(f"Adding instruction {instruction}")
    return recipes_manager.add_instruction(recipe_id=recipe_id, instruction=instruction)


@router.post("/instruction/add/many")
def add_instructions(
    recipe_id: str, instructions: List[Instruction]
) -> List[Instruction]:
    """Add many instructions to the database.

    Args:
        instructions (List[Instruction]): Instructions to add to the database
    """
    print(f"Adding {len(instructions)} instructions")
    return recipes_manager.add_instructions(
        recipe_id=recipe_id, instructions=instructions
    )


@router.post("/ingredient/add")
def add_ingredient(recipe_id: str, ingredient: Ingredient) -> Ingredient:
    """Add an ingredient to the database.

    Args:
        ingredient (Ingredient): Ingredient to add to the database
    """
    print(f"Adding ingredient {ingredient}")
    return recipes_manager.add_ingredient(recipe_id=recipe_id, ingredient=ingredient)


@router.post("/ingredient/add/many")
def add_ingredients(recipe_id: str, ingredients: List[Ingredient]) -> List[Ingredient]:
    """Add many ingredients to the database.

    Args:
        ingredients (List[Ingredient]): Ingredients to add to the database
    """
    print(f"Adding {len(ingredients)} ingredients")
    return recipes_manager.add_ingredients(recipe_id=recipe_id, ingredients=ingredients)


@router.post("/note/add")
def add_note(recipe_id: str, note: Note) -> Note:
    """Add a note to the database.

    Args:
        note (Note): Note to add to the database
    """
    print(f"Adding note {note}")
    return recipes_manager.add_note(recipe_id=recipe_id, note=note)


@router.post("/note/add/many")
def add_notes(recipe_id: str, notes: List[Note]) -> List[Note]:
    """Add many notes to the database.

    Args:
        notes (List[Note]): Notes to add to the database
    """
    print(f"Adding {len(notes)} notes")
    return recipes_manager.add_notes(recipe_id=recipe_id, notes=notes)
