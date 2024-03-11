import logging
import uuid
from typing import List

from places.service.mongo_utils import get_client, get_collection
from places.service.recipes.models import (Ingredient, Instruction, Note,
                                           RecipeModel, RecipesModel)

# Singleton manager class
_MANAGER_SINGLETON = None

logger = logging.getLogger(__name__)


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
    # Delete                                               #
    ########################################################

    def delete_all(self) -> None:
        """Drop all comments"""
        print(f"Dropping all from {self.collection_name}")
        self.collection.drop()

    def delete_recipe_by_id(self, recipe_id: str) -> None:
        """Drop a comment by id"""
        self.collection.delete_many({"id": recipe_id})
        print(f"Dropped {recipe_id} from {self.collection_name}")

    def delete_instruction_by_id(self, recipe_id: str, instruction_id: str) -> None:
        """Drop a comment by id"""
        self.collection.update_one(
            {"id": recipe_id}, {"$pull": {"instructions": {"id": instruction_id}}}
        )
        print(f"Dropped {instruction_id} from {recipe_id} in {self.collection_name}")

    def delete_ingredient_by_id(self, recipe_id: str, ingredient_id: str) -> None:
        """Drop a comment by id"""
        self.collection.update_one(
            {"id": recipe_id}, {"$pull": {"ingredients": {"id": ingredient_id}}}
        )
        print(f"Dropped {ingredient_id} from {recipe_id} in {self.collection_name}")

    def delete_note_by_id(self, recipe_id: str, note_id: str) -> None:
        """Drop a comment by id"""
        self.collection.update_one(
            {"id": recipe_id}, {"$pull": {"notes": {"id": note_id}}}
        )
        print(f"Dropped {note_id} from {recipe_id} in {self.collection_name}")

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

    def get_by_name(self, name: str) -> RecipesModel:
        """Get all recipes by name
        Args:
            name (str): Recipe name
        """
        print(f"Getting recipes for {name}")
        recipes = self.collection.find({"name": name})
        return RecipesModel(recipes=[RecipeModel(**recipe) for recipe in recipes])

    ########################################################
    # Add                                                  #
    ########################################################

    def add_recipe(self, recipe: RecipeModel) -> RecipeModel:
        """Insert a recipe into the database.
        Args:
            recipe (RecipeModel): Recipe model
        """
        print(f"Inserting {recipe.name} into {self.collection_name}")

        # If the recipe has name, lets check if it already exists
        if recipe.name:
            existing = self.get_by_name(recipe.name)
            if existing.recipes:
                print(f"Recipe {recipe.name} already exists")
                return None

        # If the recipe has an id, lets check if it already exists
        if recipe.id:
            existing = self.get(recipe.id)
            if existing:
                print(f"Recipe {recipe.id} already exists")
                return None

        try:
            # Update the recipe with a new id
            recipe.id = str(uuid.uuid4())

            # check that all notes have an id
            for note in recipe.notes:
                if note.id is None:
                    note.id = str(uuid.uuid4())
            # check that all ingredients have an id
            for ingredient in recipe.ingredients:
                if ingredient.id is None:
                    ingredient.id = str(uuid.uuid4())
            # check that all instructions have an id
            for instruction in recipe.instructions:
                if instruction.id is None:
                    instruction.id = str(uuid.uuid4())

            # Insert the recipe into the collection
            self.collection.insert_one(recipe.dict())

            # Pull the recipe from the collection
            return self.collection.find_one({"id": recipe.id})
        except Exception as e:
            print(f"Error inserting {recipe.name}: {e}")
            return None

    def add_recipes(self, recipes: List[RecipeModel]) -> List[RecipeModel]:
        """Insert a list of recipes into the database.
        Args:
            recipes (list[RecipeModel]): List of recipe models
        """
        print(f"Inserting {len(recipes)} recipes into {self.collection_name}")
        try:
            for recipe in recipes:
                self.add_recipe(recipe)
            return recipes
        except Exception as e:
            print(f"Error inserting {len(recipes)} recipes: {e}")
            return None

    def add_instruction(self, recipe_id: str, instruction: Instruction) -> Instruction:
        """Adds a single instruction to a recipe.

        Args:
            recipe_id (str): Recipe id
            instruction (Instruction): Instruction model
        """
        print(f"Adding instruction to {recipe_id}")
        try:
            # update the recipe with a new id
            instruction.id = str(uuid.uuid4())
            # add the instruction to the recipe
            self.collection.update_one(
                {"id": recipe_id}, {"$push": {"instructions": instruction.dict()}}
            )
            return instruction
        except Exception as e:
            print(f"Error adding instruction to {recipe_id}: {e}")
            return None

    def add_instructions(
        self, recipe_id: str, instructions: List[Instruction]
    ) -> List[Instruction]:
        """Adds a list of instructions to a recipe.

        Args:
            recipe_id (str): Recipe id
            instructions (list[Instruction]): List of instruction models
        """
        print(f"Adding {len(instructions)} instructions to {recipe_id}")
        try:
            for instruction in instructions:
                self.add_instruction(recipe_id, instruction)
            return instructions
        except Exception as e:
            print(f"Error adding {len(instructions)} instructions to {recipe_id}: {e}")
            return None

    def add_ingredient(self, recipe_id: str, ingredient: Ingredient) -> Ingredient:
        """Adds a single ingredient to a recipe.

        Args:
            recipe_id (str): Recipe id
            ingredient (Ingredient): Ingredient model
        """
        print(f"Adding ingredient to {recipe_id}")
        try:
            # update the recipe with a new id
            ingredient.id = str(uuid.uuid4())
            # add the ingredient to the recipe
            self.collection.update_one(
                {"id": recipe_id}, {"$push": {"ingredients": ingredient.dict()}}
            )
            return ingredient
        except Exception as e:
            print(f"Error adding ingredient to {recipe_id}: {e}")
            return None

    def add_ingredients(
        self, recipe_id: str, ingredients: List[Ingredient]
    ) -> List[Ingredient]:
        """Adds a list of ingredients to a recipe.

        Args:
            recipe_id (str): Recipe id
            ingredients (list[Ingredient]): List of ingredient models
        """
        print(f"Adding {len(ingredients)} ingredients to {recipe_id}")
        try:
            for ingredient in ingredients:
                self.add_ingredient(recipe_id, ingredient)
            return ingredients
        except Exception as e:
            print(f"Error adding {len(ingredients)} ingredients to {recipe_id}: {e}")
            return None

    def add_note(self, recipe_id: str, note: Note) -> Note:
        """Adds a single note to a recipe.

        Args:
            recipe_id (str): Recipe id
            note (Note): Note model
        """
        print(f"Adding note to {recipe_id}")
        try:
            # update the recipe with a new id
            note.id = str(uuid.uuid4())
            # add the note to the recipe
            self.collection.update_one(
                {"id": recipe_id}, {"$push": {"notes": note.dict()}}
            )
            return note
        except Exception as e:
            print(f"Error adding note to {recipe_id}: {e}")
            return None

    def add_notes(self, recipe_id: str, notes: List[Note]) -> List[Note]:
        """Adds a list of notes to a recipe.

        Args:
            recipe_id (str): Recipe id
            notes (list[Note]): List of note models
        """
        print(f"Adding {len(notes)} notes to {recipe_id}")
        try:
            for note in notes:
                self.add_note(recipe_id, note)
            return notes
        except Exception as e:
            print(f"Error adding {len(notes)} notes to {recipe_id}: {e}")
            return None

    ########################################################
    # Update                                               #
    ########################################################

    def update_recipe(self, recipe: RecipeModel) -> RecipeModel:
        """Update a recipe in the database.
        Args:
            recipe (RecipeModel): Recipe to update in the database
        """
        print(f"Updating recipe {recipe.name}")
        try:
            # check that all notes have an id
            for note in recipe.notes:
                if note.id is None:
                    note.id = str(uuid.uuid4())

            # check that all ingredients have an id
            for ingredient in recipe.ingredients:
                if ingredient.id is None:
                    ingredient.id = str(uuid.uuid4())

            # check that all instructions have an id
            for instruction in recipe.instructions:
                if instruction.id is None:
                    instruction.id = str(uuid.uuid4())

            # update the recipe in the collection
            self.collection.update_one({"id": recipe.id}, {"$set": recipe.dict()})
            return recipe

        except Exception as e:
            print(f"Error updating recipe {recipe.name}: {e}")
            return None

    def update_instruction(
        self, recipe: RecipeModel, instruction: Instruction
    ) -> Instruction:
        """Update an instruction in the database.
        Args:
            instruction (Instruction): Instruction to update in the database
        """
        print(f"Updating instruction {instruction}")
        try:
            # update the instruction with a new id
            if instruction.id is None:
                instruction.id = str(uuid.uuid4())

            # update the instruction in the collection
            if instruction.id in [i.id for i in recipe.instructions]:
                self.collection.update_one(
                    {"id": recipe.id, "instructions.id": instruction.id},
                    {"$set": {"instructions.$": instruction.dict()}},
                    upsert=True,
                )
            # if the instruction does not exist, add it
            else:
                self.collection.update_one(
                    {"id": recipe.id},
                    {"$push": {"instructions": instruction.dict()}},
                    upsert=True,
                )

            return instruction
        except Exception as e:
            print(f"Error updating instruction {instruction}: {e}")
            return None

    def update_instrucitons(
        self, recipe: RecipeModel, instructions: List[Instruction]
    ) -> List[Instruction]:
        """Update a list of instructions in the database.
        Args:
            instructions (list[Instruction]): Instructions to update in the database
        """
        print(f"Updating {len(instructions)} instructions")
        try:
            for instruction in instructions:
                self.update_instruction(recipe, instruction)
            return instructions
        except Exception as e:
            print(f"Error updating {len(instructions)} instructions: {e}")
            return None

    def update_ingredient(
        self, recipe: RecipeModel, ingredient: Ingredient
    ) -> Ingredient:
        """Update an ingredient in the database.
        Args:
            ingredient (Ingredient): Ingredient to update in the database
        """
        print(f"Updating ingredient {ingredient}")
        try:
            # update the ingredient with a new id
            if ingredient.id is None:
                ingredient.id = str(uuid.uuid4())

            # update the ingredient in the collection
            if ingredient.id in [i.id for i in recipe.ingredients]:
                self.collection.update_one(
                    {"id": recipe.id, "ingredients.id": ingredient.id},
                    {"$set": {"ingredients.$": ingredient.dict()}},
                    upsert=True,
                )
            # if the ingredient does not exist, add it
            else:
                self.collection.update_one(
                    {"id": recipe.id},
                    {"$push": {"ingredients": ingredient.dict()}},
                    upsert=True,
                )
            return ingredient
        except Exception as e:
            print(f"Error updating ingredient {ingredient}: {e}")
            return None

    def update_ingredients(
        self, recipe: RecipeModel, ingredients: List[Ingredient]
    ) -> List[Ingredient]:
        """Update a list of ingredients in the database.
        Args:
            ingredients (list[Ingredient]): Ingredients to update in the database
        """
        print(f"Updating {len(ingredients)} ingredients")
        try:
            for ingredient in ingredients:
                self.update_ingredient(recipe, ingredient)
            return ingredients
        except Exception as e:
            print(f"Error updating {len(ingredients)} ingredients: {e}")
            return None

    def update_note(self, recipe: RecipeModel, note: Note) -> Note:
        """Update a note in the database.
        Args:
            note (Note): Note to update in the database
        """
        print(f"Updating note {note}")
        try:
            # update the note with a new id
            if note.id is None:
                note.id = str(uuid.uuid4())

            # update the note in the collection
            if note.id in [n.id for n in recipe.notes]:
                self.collection.update_one(
                    {"id": recipe.id, "notes.id": note.id},
                    {"$set": {"notes.$": note.dict()}},
                    upsert=True,
                )
            # if the note does not exist, add it
            else:
                self.collection.update_one(
                    {"id": recipe.id},
                    {"$push": {"notes": note.dict()}},
                    upsert=True,
                )
            return note
        except Exception as e:
            print(f"Error updating note {note}: {e}")
            return None

    def update_notes(self, recipe: RecipeModel, notes: List[Note]) -> List[Note]:
        """Update a list of notes in the database.
        Args:
            notes (list[Note]): Notes to update in the database
        """
        print(f"Updating {len(notes)} notes")
        try:
            for note in notes:
                self.update_note(recipe, note)
            return notes
        except Exception as e:
            print(f"Error updating {len(notes)} notes: {e}")
            return None
