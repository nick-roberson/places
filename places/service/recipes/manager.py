from places.service.recipes.models import (
    RecipesModel,
    RecipeModel,
    Instruction,
    Ingredient,
    Note,
)
from places.service.mongo_utils import get_client, get_collection
import uuid
from typing import List

# Singleton manager class
_MANAGER_SINGLETON = None


def get_manager():
    global _MANAGER_SINGLETON
    if _MANAGER_SINGLETON is None:
        _MANAGER_SINGLETON = RecipeManager()
    return _MANAGER_SINGLETON


class RecipeManager:
    def __init__(self):
        self.client = get_client()
        self.collection_name = "recipes"
        self.collection = get_collection(self.client, self.collection_name)

    ########################################################
    # Drop                                                 #
    ########################################################

    def drop_all(self) -> None:
        """Drop all comments"""
        print(f"Dropping all from {self.collection_name}")
        self.collection.drop()

    def drop_by_id(self, recipe_id: str) -> None:
        """Drop a comment by id"""
        self.collection.delete_many({"id": recipe_id})
        print(f"Dropped {recipe_id} from {self.collection_name}")

    ########################################################
    # Get                                                  #
    ########################################################

    def get_all(self) -> RecipesModel:
        """Get all recipes.
        Returns:
            RecipesModel: Recipes model
        """
        print(f"Getting all recipes")
        recipes = self.collection.find()
        return RecipesModel(recipes=[RecipeModel(**recipe) for recipe in recipes])

    def get(self, recipe_id: str) -> RecipeModel:
        """Get a single RecipeModel by id
        Args:
            recipe_id (str): Recipe id
        """
        print(f"Getting recipes for {recipe_id}")
        recipe = self.collection.find_one({"id": recipe_id})
        return RecipeModel(**recipe)

    ########################################################
    # Add                                                  #
    ########################################################

    def add(self, recipe: RecipeModel) -> RecipeModel:
        """Insert a recipe into the database.
        Args:
            recipe (RecipeModel): Recipe model
        """
        print(f"Inserting {recipe.name} into {self.collection_name}")
        try:
            recipe.id = str(uuid.uuid4())
            self.collection.insert_one(recipe.dict())
            return recipe
        except Exception as e:
            print(f"Error inserting {recipe.name}: {e}")
            return None

    def add_instruction(self, recipe_id: str, instruction: Instruction) -> Instruction:
        """Adds a single instruction to a recipe.

        Args:
            recipe_id (str): Recipe id
            instruction (Instruction): Instruction model
        """
        print(f"Adding instruction to {recipe_id}")
        try:
            self.collection.update_one(
                {"id": recipe_id}, {"$push": {"instructions": instruction.dict()}}
            )
            return instruction
        except Exception as e:
            print(f"Error adding instruction to {recipe_id}: {e}")
            return None

    def add_ingredient(self, recipe_id: str, ingredient: Ingredient) -> Ingredient:
        """Adds a single ingredient to a recipe.

        Args:
            recipe_id (str): Recipe id
            ingredient (Ingredient): Ingredient model
        """
        print(f"Adding ingredient to {recipe_id}")
        try:
            self.collection.update_one(
                {"id": recipe_id}, {"$push": {"ingredients": ingredient.dict()}}
            )
            return ingredient
        except Exception as e:
            print(f"Error adding ingredient to {recipe_id}: {e}")
            return None

    def add_note(self, recipe_id: str, note: Note) -> Note:
        """Adds a single note to a recipe.

        Args:
            recipe_id (str): Recipe id
            note (Note): Note model
        """
        print(f"Adding note to {recipe_id}")
        try:
            self.collection.update_one(
                {"id": recipe_id}, {"$push": {"notes": note.dict()}}
            )
            return note
        except Exception as e:
            print(f"Error adding note to {recipe_id}: {e}")
            return None
