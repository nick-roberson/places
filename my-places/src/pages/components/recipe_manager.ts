import { DefaultApi } from "../../api";
import getAPIClient from "./api_client";
import { RecipeModel, Ingredient, Note, Instruction } from "../../api";

class RecipeManager {
    api: DefaultApi;
    recipe: RecipeModel;

    constructor(recipe: RecipeModel) {
        this.api = getAPIClient();
        this.recipe = recipe;
    }

    // GET LOCALLY
    getIngredients(): Ingredient[] {
        return this.recipe.ingredients;
    }
    getInstructions(): Instruction[] {
        return this.recipe.instructions;
    }
    getNotes(): Note[] {
        return this.recipe.notes;
    }

    // ADD LOCALLY
    addIngredient(ingredient: Ingredient) {
        this.recipe.ingredients.push(ingredient);
    }
    addInstruction(instruction: Instruction) {
        this.recipe.instructions.push(instruction);
    }
    addNote(note: Note) {
        this.recipe.notes.push(note);
    }

    // REMOVE LOCALLY
    removeIngredient(ingredient: Ingredient) {
        this.recipe.ingredients = this.recipe.ingredients.filter(
            (i: Ingredient) => i.id !== ingredient.id,
        );
    }
    removeInstruction(instruction: Instruction) {
        this.recipe.instructions = this.recipe.instructions.filter(
            (i: Instruction) => i.id !== instruction.id,
        );
    }
    removeNote(note: Note) {
        this.recipe.notes = this.recipe.notes.filter(
            (i: Note) => i.id !== note.id,
        );
    }

    // UPDATE LOCALLY AND DB
    updateIngredient(ingredient: Ingredient) {
        console.log("Updating ingredient", ingredient);
        const index = this.recipe.ingredients.findIndex(
            (i: Ingredient) => i.id === ingredient.id,
        );
        this.recipe.ingredients[index] = ingredient;
        this.api.updateIngredientIngredientUpdatePut({
            recipeId: this.recipe.id,
            ingredient: ingredient,
        });
    }
    updateInstruction(instruction: Instruction) {
        console.log("Updating instruction", instruction);
        const index = this.recipe.instructions.findIndex(
            (i: Instruction) => i.id === instruction.id,
        );
        this.recipe.instructions[index] = instruction;
        this.api.updateInstructionInstructionUpdatePut({
            recipeId: this.recipe.id,
            instruction: instruction,
        });
    }
    updateNote(note: Note) {
        console.log("Updating note", note);
        const index = this.recipe.notes.findIndex(
            (i: Note) => i.id === note.id,
        );
        this.recipe.notes[index] = note;
        this.api.updateNoteNoteUpdatePut({
            recipeId: this.recipe.id,
            note: note,
        });
    }

    // SAVE ALL LOCALLY AND DB
    async saveRecipe() {
        await this.api.updateRecipeRecipesUpdatePut({
            recipeModel: this.recipe,
        });
    }

    // REFRESH RECIPE FROM DB
    async refreshRecipe() {
        this.recipe = await this.api.getRecipesRecipeIdGet({
            recipeId: this.recipe.id,
        });
    }
}

export default RecipeManager;
