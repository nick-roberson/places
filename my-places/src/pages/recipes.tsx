// Simple home page
import React, { useState, useEffect } from 'react';

// Third Party
import Icon from '@mui/material/Icon';
import Input from '@mui/joy/Input';
import Grid from '@mui/system/Unstable_Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { DataGrid, GridToolbar, GridColDef} from '@mui/x-data-grid';
import { createSvgIcon } from '@mui/material/utils';
import Stack from '@mui/material/Stack';

// My imports
import { Configuration } from '../api';
import { DefaultApi } from '../api/apis';
import { RecipeModel } from '../api';
import { Ingredient } from '../api';
import { Instruction } from '../api';
import { Note } from '../api';
import { Divider, IconButton } from '@mui/material';


const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>,
    'Plus',
);

// DataGrid columns for ingredients, instructions, and notes
const ingredientCols: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'measurement', headerName: 'Measurement', width: 120 },
    { field: 'preparation', headerName: 'Preparation', width: 1000 },
];

const instructionCols: GridColDef[] = [
    { field: 'step', headerName: 'Step', width: 50 },
    { field: 'description', headerName: 'Description', width: 1000 },
];

const noteCols: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'body', headerName: 'Body', width: 1000 },
];

// Function to take in apiClient and return all reicpes 
const getRecipes = async (apiClient: DefaultApi) => {
    const recipes = await apiClient.getAllRecipesAllGet();
    return recipes.recipes;
}

const addNote = async (apiClient: DefaultApi, recipe: RecipeModel) => {
    // if the recipe does not have an id, throw an error
    if (!recipe.id) {
        throw new Error("Recipe does not have an id");
    }

    // get the note title and body
    const title = document.getElementById("new-note-title") as HTMLInputElement;
    const body = document.getElementById("new-note-body") as HTMLInputElement;
    if (!title || !body) {
        throw new Error("Could not find the note title or body");
    }

    // create the note
    const note = {
        title: title.value,
        body: body.value,
    };

    // add the note to the recipe
    const response = await apiClient.addNoteNoteAddPost({
        recipeId: recipe.id,
        note: note,
    });

    return response;
}

const addInstruction = async (apiClient: DefaultApi, recipe: RecipeModel) => {
    // if the recipe does not have an id, throw an error
    if (!recipe.id) {
        throw new Error("Recipe does not have an id");
    }

    // get the instruction step and description
    const step = document.getElementById("new-instruction-step") as HTMLInputElement;
    const description = document.getElementById("new-instruction-description") as HTMLInputElement;
    if (!step || !description) {
        throw new Error("Could not find the instruction step or description");
    }

    // create the instruction
    const instruction = {
        step: step.value,
        description: description.value,
    };

    // add the instruction to the recipe
    const response = await apiClient.addInstructionInstructionAddPost({
        recipeId: recipe.id,
        instruction: instruction,
    });

    return response;
}

const addIngredient = async (apiClient: DefaultApi, recipe: RecipeModel) => {
    // if the recipe does not have an id, throw an error
    if (!recipe.id) {
        throw new Error("Recipe does not have an id");
    }

    // get the ingredient name, quantity, measurement, and preparation
    const name = document.getElementById("new-ingredient-name") as HTMLInputElement;
    const quantity = document.getElementById("new-ingredient-quantity") as HTMLInputElement;
    const measurement = document.getElementById("new-ingredient-measurement") as HTMLInputElement;
    const preparation = document.getElementById("new-ingredient-preparation") as HTMLInputElement;
    if (!name || !quantity || !measurement || !preparation) {
        throw new Error("Could not find the ingredient name, quantity, measurement, or preparation");
    }

    // create the ingredient
    const ingredient = {
        name: name.value,
        quantity: quantity.value,
        measurement: measurement.value,
        preparation: preparation.value,
    };

    // add the ingredient to the recipe
    const response = await apiClient.addIngredientIngredientAddPost({
        recipeId: recipe.id,
        ingredient: ingredient,
    });

    return response;
}


const displayRecipe = (apiClient: DefaultApi, recipe: RecipeModel) => {

    // Ingredient DataGrid
    const ingredientRows = recipe.ingredients?.map((ingredient: Ingredient) => {
        return {
            id: ingredient.id,
            name: ingredient.name,
            quantity: ingredient.quantity,
            measurement: ingredient.measurement,
            preparation: ingredient.preparation,
        };
    });

    // Instructions DataGrid
    const instructionRows = recipe.instructions?.map((instruction: Instruction) => {
        return {
            id: instruction.id,
            step: instruction.step,
            description: instruction.description,
        };
    });

    // Notes DataGrid
    const noteRows = recipe.notes?.map((note: Note) => {
        return {
            id: note.id,
            title: note.title,
            body: note.body,
        };
    });

    return (
        <div>

            <Typography variant="h6" gutterBottom>Name: {recipe.name}</Typography>
            <p> <strong>Description: </strong> {recipe.description} </p>
            <p> <strong>Source: </strong> {recipe.source?.toString()} </p>

            {/* Display the ingredients  as a list */}
            {
                recipe.ingredients ? (
                    <Box>

                        <h3>Ingredients</h3>
                        <Grid container spacing={2}  m={.5}>
                            <Grid xs={2} m={.25}><Input id="new-ingredient-name" placeholder="Name"/></Grid>
                            <Grid xs={2} m={.25}><Input id="new-ingredient-quantity" placeholder="Quantity" /></Grid>
                            <Grid xs={2} m={.25}><Input id="new-ingredient-measurement" placeholder="Measurement" /></Grid>
                            <Grid xs={3} m={.25}><Input id="new-ingredient-preparation" placeholder="Preparation" /></Grid>
                            <Grid xs={2} m={.25}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addIngredient(apiClient, recipe)}>Add Ingredient
                                </Button>
                            </Grid>
                        </Grid>

                        <DataGrid
                            rows={ingredientRows}
                            columns={ingredientCols}
                            initialState={
                                {
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }
                            }
                            pageSizeOptions={[10, 20]}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                ) : "No ingredients yet."
            }

            <Divider />

            {/* Display the instructions as a list */}
            {
                recipe.instructions ? (
                    <Accordion>
                        <AccordionSummary>
                            Instructions
                        </AccordionSummary>
                        <AccordionDetails>
                            <DataGrid
                                rows={instructionRows}
                                columns={instructionCols}
                                initialState={
                                    {
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }
                                }
                                pageSizeOptions={[10, 20]}
                                slots={{ toolbar: GridToolbar }}
                            />
                        </AccordionDetails>

                        <Grid container spacing={2}  m={.5}>
                            <Grid xs={3} m={.5}><Input id="new-instruction-step" placeholder="Step"/></Grid>
                            <Grid xs={6} m={.5}><Input id="new-instruction-description" placeholder="Description" /></Grid>
                            <Grid xs={2} m={.5}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addInstruction(apiClient, recipe)}>Add Instruction
                                </Button>
                            </Grid>
                        </Grid>

                    </Accordion>
                ) : "No instructions yet."
            }

            <Divider/>

            {/* Display the notes as a list */}
            {
                recipe.notes ? (
                    <Accordion>
                        <AccordionSummary>
                            Notes
                        </AccordionSummary>
                        <AccordionDetails>
                            <DataGrid
                                rows={noteRows}
                                columns={noteCols}
                                initialState={
                                    {
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }
                                }
                                pageSizeOptions={[10, 20]}
                                slots={{ toolbar: GridToolbar }}
                            />
                        </AccordionDetails>

                        <Grid container spacing={2} m={.5}>
                            <Grid xs={3} m={.5}><Input id="new-note-title" placeholder="Title"/></Grid>
                            <Grid xs={6} m={.5}><Input id="new-note-body" placeholder="Body" /></Grid>
                            <Grid xs={2} m={.5}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addNote(apiClient, recipe)}>Add Note
                                </Button>
                            </Grid>
                        </Grid>
                    </Accordion>
                ) : "No notes yet"
            }


        </div>
    );
}


export function MyRecipes() {

    // api client and recipes state
    const [apiClient, setApiClient] = React.useState<DefaultApi | null>(null);
    const [allRecipes, setAllRecipes] = React.useState<RecipeModel[] | null>(null);
    const [selectedRecipe, setSelectedRecipe] = React.useState<RecipeModel | null>(null);

    // Runs Once: Initialize your API client with the base URL
    useEffect(() => {
        // create a new api client
        const configuration = new Configuration({
            basePath: "http://localhost:8000",
        });
        const api = new DefaultApi(configuration);

        // set the api client
        setApiClient(api);

        // load the recipes 
        getRecipes(api).then((recipes) => {
            setAllRecipes(recipes);
            // set the selected recipe to the first recipe
            setSelectedRecipe(recipes[0]);
        });

    }, []);

    // Function to add a new recipe
    const addRecipe = async (apiClient: DefaultApi | null) => {
        if (!apiClient) {
            throw new Error("No API client");
        }
        const newRecipe = {
            name: "New Recipe",
            description: "New Description",
            source: "New Source",
        };
        const response = await apiClient.addRecipeRecipesAddPost({ recipeModel: newRecipe });
        return response;
    }

    // Function to refresh the recipes
    const refreshRecipes = async (apiClient: DefaultApi | null) => {
        if (!apiClient) {
            throw new Error("No API client");
        }
        const recipes = await getRecipes(apiClient);
        setAllRecipes(recipes);
    }

    return (
        <div>
            <Grid container spacing={2}>

                {/* Display the recipes in a toolbar on the left */}
                <Grid xs={2} m={2}>
                    <Box>
                        <Stack direction="row" spacing={3}>
                            <Typography variant="h4" gutterBottom>
                                Recipes
                            </Typography>

                            <Typography variant="h4" gutterBottom>
                                <Button
                                    onClick={() => addRecipe(apiClient).then((any) => refreshRecipes(apiClient))}
                                >
                                    <PlusIcon color="primary"/>
                                </Button>
                            </Typography>

                        </Stack>
                        <List>
                            {allRecipes?.map((recipe) => (
                                <ListItem>
                                    <ListItemText 
                                        primary={recipe.name}
                                        onClick={() => setSelectedRecipe(recipe)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>

                {/* Display the recipe details on the right */}
                <Grid xs={9} m={2}>
                    <Box>
                        {apiClient && selectedRecipe ? displayRecipe(apiClient, selectedRecipe) : <Alert severity="error">No recipe selected</Alert>}
                    </Box>
                </Grid>

            </Grid>
        </div>
    );
}

export default MyRecipes;
