// Simple home page
import React, { useState, useEffect, useRef } from 'react';

// Third Party
import Input from '@mui/joy/Input';
import Grid from '@mui/system/Unstable_Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { DataGrid, GridToolbar, GridColDef} from '@mui/x-data-grid';
import { createSvgIcon } from '@mui/material/utils';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';

// My imports
import { Configuration } from '../api';
import { DefaultApi } from '../api/apis';
import { RecipeModel } from '../api';
import { Ingredient, IngredientFromJSON, IngredientToJSON} from '../api';
import { Instruction, InstructionFromJSON, InstructionToJSON } from '../api';
import { Note, NoteFromJSON, NoteToJSON } from '../api';
import { Divider, IconButton } from '@mui/material';


const getAPIClient = () => {
    const configuration = new Configuration({
        basePath: "http://localhost:8000",
    });
    const api = new DefaultApi(configuration);
    return api;
}
   

const renderDeleteIngredient = (params: any) => {
    // Render the delete Icon in the table
    return (
        <strong>
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon
                    onClick={() => {
                        const api = getAPIClient();
                        try {
                            const body = { recipeId: params.row.recipeId, ingredientId: params.row.id }
                            api.deleteIngredientIngredientDeleteDelete(body).then((response) => {
                                console.log('Deleted ingredient', response);
                            });
                        } catch (error) {
                            console.error('Error deleting ingredient', error);
                        }
                    }
                }
                />
            </IconButton>
        </strong>
    )
}

const renderDeleteInstruction = (params: any) => {
    // Render the delete Icon in the table
    return (
        <strong>
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon
                    onClick={() => {
                        const api = getAPIClient();
                        try {
                            const body = { recipeId: params.row.recipeId, instructionId: params.row.id }
                            api.deleteInstructionInstructionDeleteDelete(body).then((response) => {
                                console.log('Deleted instruction', response);
                            });
                        } catch (error) {
                            console.error('Error deleting instruction', error);
                        }
                    }
                }
                />
            </IconButton>
        </strong>
    )
}

const renderDeleteNote = (params: any) => {
    // Render the delete Icon in the table
    return (
        <strong>
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon
                    onClick={() => {
                        const api = getAPIClient();
                        try {
                            const body = { recipeId: params.row.recipeId, noteId: params.row.id }
                            api.deleteNoteNoteDeleteDelete(body).then((response) => {
                                console.log('Deleted note', response);
                            });
                        } catch (error) {
                            console.error('Error deleting note', error);
                        }
                    }
                }
                />
            </IconButton>
        </strong>
    )
}

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
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'quantity', headerName: 'Qty', width: 75, editable: true },
    { field: 'measurement', headerName: 'Unit', width: 75, editable: true },
    { field: 'preparation', headerName: 'Prep', width: 200, editable: true },
    { field: 'delete', headerName: 'Delete', width: 100, renderCell: renderDeleteIngredient},
];

const instructionCols: GridColDef[] = [
    { field: 'step', headerName: 'Step', width: 200, editable: true },
    { field: 'description', headerName: 'Description', width: 800, editable: true },
    { field: 'delete', headerName: 'Delete', width: 100, renderCell: renderDeleteInstruction},
];

const noteCols: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150, editable: true },
    { field: 'body', headerName: 'Body', width: 350, editable: true },
    { field: 'delete', headerName: 'Delete', width: 100, renderCell: renderDeleteNote},
];

// Function to take in apiClient and return all reicpes 
const getRecipes = async (apiClient: DefaultApi) => {
    const recipes = await apiClient.getAllRecipesAllGet();
    return recipes.recipes;
}

const deleteRecipe = async (apiClient: DefaultApi, recipe: RecipeModel) => {
    // if the recipe does not have an id, throw an error
    if (!recipe.id) {
        throw new Error("Recipe does not have an id");
    }
    // delete the recipe
    const response = await apiClient.deleteRecipeRecipesDeleteDelete({ recipeId: recipe.id });
    return response;
}


// Function to create rows for the ingredient, instruction, and note DataGrids
const createIngredientRowsFromRecipe = (recipe: RecipeModel) => {
    return recipe.ingredients?.map((ingredient: Ingredient) => {
        return {
            id: ingredient.id,
            recipeId: recipe.id,
            name: ingredient.name,
            quantity: ingredient.quantity,
            measurement: ingredient.measurement,
            preparation: ingredient.preparation,
        };
    });
}

const createInstructionRowsFromRecipe = (recipe: RecipeModel) => {
    return recipe.instructions?.map((instruction: Instruction) => {
        return {
            id: instruction.id,
            recipeId: recipe.id,
            step: instruction.step,
            description: instruction.description,
        };
    });
}

const createNoteRowsFromRecipe = (recipe: RecipeModel) => {
    return recipe.notes?.map((note: Note) => {
        return {
            id: note.id,
            recipeId: recipe.id,
            title: note.title,
            body: note.body,
        };
    });
}

const MutateIngredientRowCallback = () => {
    return React.useCallback(
      (recipe: RecipeModel, ingredient: Ingredient) =>
        new Promise<Ingredient>((resolve, reject) => {
          setTimeout(() => {
            console.log("updating ingredient", ingredient)
            const apiClient = getAPIClient();
            apiClient.updateIngredientIngredientUpdatePut({recipeId: recipe.id, ingredient: ingredient});
            resolve({ ...ingredient });
          }, 200);
        }),
      [],
    );
};

const MutateInstructionRowCallback = () => {
    return React.useCallback(
      (recipe: RecipeModel, instruction: Instruction) =>
        new Promise<Instruction>((resolve, reject) => {
          setTimeout(() => {
            console.log("updating instruction", instruction)
            const apiClient = getAPIClient();
            apiClient.updateInstructionInstructionUpdatePut({recipeId: recipe.id, instruction: instruction});
            resolve({ ...instruction });
          }, 200);
        }),
      [],
    );
}

const MutateNoteRowCallback = () => {
    return React.useCallback(
      (recipe: RecipeModel, note: Note) =>
        new Promise<Note>((resolve, reject) => {
          setTimeout(() => {
            console.log("updating note", note)
            const apiClient = getAPIClient();
            apiClient.updateNoteNoteUpdatePut({recipeId: recipe.id, note: note});
            resolve({ ...note });
          }, 200);
        }),
      [],
    );
}

export function MyRecipes() {

    // api client and recipes state
    const [apiClient, setApiClient] = React.useState<DefaultApi | null>(null);
    const [allRecipes, setAllRecipes] = React.useState<RecipeModel[] | null>(null);

    // selected recipe state
    const [selectedRecipe, setSelectedRecipe] = React.useState<RecipeModel | null>(null);
    const selectedRecipeRef = useRef(selectedRecipe);
    const setSelectedRecipeState = (recipe: RecipeModel) => {
        // set the current selected recipe and update the ref
        setSelectedRecipe(recipe);
        selectedRecipeRef.current = recipe;
        // create the rows for the ingredient, instruction, and note DataGrids
        setIngredientRows(createIngredientRowsFromRecipe(recipe));
        setInstructionRows(createInstructionRowsFromRecipe(recipe));
        setNoteRows(createNoteRowsFromRecipe(recipe));
    }

    // Runs Once: Initialize your API client with the base URL
    useEffect(() => {
        // set the api client
        const apiClient = getAPIClient();
        setApiClient(apiClient);

        // get all recipes and set the current one to the first one
        getRecipes(apiClient).then((recipes) => {
            setAllRecipes(recipes);
            if (recipes.length > 0) {
                setSelectedRecipeState(recipes[0]);
            } else {
                setSelectedRecipe(null);
            }
        });
    }, []);

    // Function to refresh the recipes
    const refreshRecipes = async (apiClient: DefaultApi | null) => {
        if (!apiClient) {
            throw new Error("No API client");
        }
        const recipes = await getRecipes(apiClient);
        setAllRecipes(recipes);
        if (recipes.length > 0) {
            setSelectedRecipeState(recipes[0]);
        } else {
            setSelectedRecipe(null);
        }
    }

    // Dialog state
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleDialogCreate = async () => {
        // Create the new recipe
        if (!apiClient) {
            throw new Error("No API client");
        }
        const response = await apiClient.addRecipeRecipesAddPost({ recipeModel: {
            name: newRecipeName,
            description: newRecipeDescription,
            source: newRecipeSource,
        } });
        // Close 
        handleDialogClose();
    }
    const handleDialogClose = () => {
      setOpen(false);
    };

    // Dialog for adding a new recipe
    const [newRecipeName, setNewRecipeName] = React.useState("");
    const [newRecipeDescription, setNewRecipeDescription] = React.useState("");
    const [newRecipeSource, setNewRecipeSource] = React.useState("");

    // Create rows for the ingredient, instruction, and note DataGrids
    const [ingredientRows, setIngredientRows] = React.useState([]);
    const [instructionRows, setInstructionRows] = React.useState([]);
    const [noteRows, setNoteRows] = React.useState([]);

    // Create function to add a row to the Ingredients DataGrid
    const addIngredientRow = async () => {
        if (!selectedRecipe) {
            throw new Error("No API client or selected recipe");
        }
        const new_ingredient = IngredientFromJSON({
            id: Math.floor(Math.random() * 1000000).toString(),
            name: "",
            quantity: "",
            measurement: "",
            preparation: "",
        });
        selectedRecipe.ingredients?.push(new_ingredient);
        setSelectedRecipeState(selectedRecipe);
    }

    const addInstructionRow = async () => {
        if (!selectedRecipe) {
            throw new Error("No API client or selected recipe");
        }
        const new_instruction = InstructionFromJSON({
            id: Math.floor(Math.random() * 1000000).toString(),
            step: "",
            description: "",
        });
        selectedRecipe.instructions?.push(new_instruction);
        setSelectedRecipeState(selectedRecipe);
    }

    const addNoteRow = async () => {
        if (!selectedRecipe) {
            throw new Error("No API client or selected recipe");
        }
        const new_note = NoteFromJSON({
            id: Math.floor(Math.random() * 1000000).toString(),
            title: "",
            body: "",
        });
        selectedRecipe.notes?.push(new_note);
        setSelectedRecipeState(selectedRecipe);
    }

    const saveInstructionRows = async () => {
        if (!selectedRecipe) {
            throw new Error("No API client or selected recipe");
        }
        if (!apiClient) {
            throw new Error("No API client");
        }
        console.log(selectedRecipe.instructions)
        const response = await apiClient.updateInstructionsInstructionUpdateManyPut({
            recipeId: selectedRecipe.id,
            body: selectedRecipe.instructions,
        });
        setSelectedRecipeState(selectedRecipe);
    }

    const saveIngredientRows = async () => {
        if (!selectedRecipe) {
            throw new Error("No API client or selected recipe");
        }
        if (!apiClient) {
            throw new Error("No API client");
        }
        console.log(ingredientRows)
        console.log(selectedRecipe.ingredients)
        const ingredients_list = selectedRecipe.ingredients?.map(IngredientToJSON);
        console.log(ingredients_list)
        const response = await apiClient.updateIngredientsIngredientUpdateManyPut({
            recipeId: selectedRecipe.id,
            body: ingredients_list,
        });
        setSelectedRecipeState(selectedRecipe);
    }

    const saveNoteRows = async () => {
        if (!selectedRecipe) {
            throw new Error("No API client or selected recipe");
        }
        if (!apiClient) {
            throw new Error("No API client");
        }
        const response = await apiClient.updateNotesNoteUpdateManyPut({
            recipeId: selectedRecipe.id,
            body: selectedRecipe.notes,
        });
        setSelectedRecipeState(selectedRecipe);
    }

    // update when an ingredient row is changed
    const mutateIngredientRow = MutateIngredientRowCallback();
    const processIngredientRowUpdate = React.useCallback(
        async (newRow: Ingredient, oldRow: Ingredient) => {
            const recipe = selectedRecipeRef.current;
            console.log(recipe)
            if (!recipe) {
                throw new Error("No selected recipe");
            }
            return await mutateIngredientRow(recipe, newRow);
        },
        [mutateIngredientRow],
    );

    // update when an instruction row is changed
    const mutateInstructionRow = MutateInstructionRowCallback();
    const processInstructionRowUpdate = React.useCallback(
        async (newRow: Instruction, oldRow: Instruction) => {
            const recipe = selectedRecipeRef.current;
            if (!recipe) {
                throw new Error("No selected recipe");
            }
            return await mutateInstructionRow(recipe, newRow);
        },
        [mutateInstructionRow],
    );

    // update when a note row is changed 
    const mutateNoteRow = MutateNoteRowCallback();
    const processNoteRowUpdate = React.useCallback(
        async (newRow: Note, oldRow: Note) => {
            const recipe = selectedRecipeRef.current;
            if (!recipe) {
                throw new Error("No selected recipe");
            }
            return await mutateNoteRow(recipe, newRow);
        },
        [mutateNoteRow],
    );

    const handleProcessRowUpdateError = React.useCallback((error: Error) => {
        console.error(error);
    }, []);
    
    
    const displayRecipe = (recipe: RecipeModel) => {
        return (
            <div>
                <Typography variant="h6" gutterBottom>Name: {recipe.name}</Typography>
                <p> <strong>Description: </strong> {recipe.description} </p>
                <p> <strong>Source: </strong> {recipe.source?.toString()} </p>

                <Divider textAlign='left'><h3>Ingredients + Notes </h3></Divider>
                <Grid container spacing={2} xs={12}>
                    <Grid xs={6}>
                        <Button color="primary" onClick={addIngredientRow}><strong>Add Ingredient</strong></Button>
                        {
                            recipe.ingredients && recipe.ingredients?.length > 0 ? (
                                <Grid>
                                    <DataGrid
                                        rows={ingredientRows}
                                        columns={ingredientCols}
                                        processRowUpdate={processIngredientRowUpdate}  
                                        onProcessRowUpdateError={handleProcessRowUpdateError}       
                                        density="compact"
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
                                </Grid>
                            ) : <div><br></br><p>No ingredients yet. Add one to get started.</p></div>
                        }
                    </Grid>

                    <Grid xs={6}>
                        <Button color="primary" onClick={addNoteRow}><strong>Add Note</strong></Button>
                        {
                            recipe.notes && recipe.notes?.length > 0 ? (
                                <Grid>
                                    <DataGrid
                                        rows={noteRows}
                                        columns={noteCols}
                                        density="compact"
                                        processRowUpdate={processNoteRowUpdate}
                                        onProcessRowUpdateError={handleProcessRowUpdateError}
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
                                </Grid>
                                ) : <div><br></br><p>No notes yet. Add one to get started.</p></div>
                        }
                    </Grid>
                </Grid>
    
                <Divider textAlign='left'><h3>Instructions</h3></Divider>

                <Button color="primary" onClick={addInstructionRow}><strong>Add Instruction</strong></Button>
                {
                    recipe.instructions && recipe.instructions?.length > 0 ? (
                        <Grid>
                            <DataGrid
                                rows={instructionRows}
                                columns={instructionCols}
                                density="compact"
                                processRowUpdate={processInstructionRowUpdate}
                                onProcessRowUpdateError={handleProcessRowUpdateError}
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
                        </Grid>
                        ) : <div><br></br><p>No instructions yet. Add one to get started.</p></div>
                }
    
            </div>
        );
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

                            {/* Add new recipe button */}
                            <Typography variant="h4" gutterBottom>
                                <Button
                                    onClick={() => setOpen(true)}
                                >
                                    <PlusIcon color="primary"/>
                                </Button>
                            </Typography>

                            {/* Dialog for adding a new recipe */}
                            <Dialog
                                fullScreen={fullScreen}
                                open={open}
                                onClose={handleDialogClose}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    {"Add new recipe!"}
                                </DialogTitle>

                                <DialogContent>
                                    <Input id="new-recipe-name" placeholder="Name" onChange={(e) => setNewRecipeName(e.target.value)}/>
                                    <Input id="new-recipe-description" placeholder="Description" onChange={(e) => setNewRecipeDescription(e.target.value)}/>
                                    <Input id="new-recipe-source" placeholder="Source" onChange={(e) => setNewRecipeSource(e.target.value)}/>
                                </DialogContent>

                                <DialogActions>
                                    <Button autoFocus onClick={handleDialogClose}>
                                        Close
                                    </Button>
                                    <Button onClick={handleDialogCreate} autoFocus>
                                        Create
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </Stack>
                        <List>
                            {apiClient && allRecipes?.map((recipe) => (
                                <ListItem>

                                    {/* Recipe name */}
                                    <ListItemText 
                                        primary={recipe.name}
                                        onClick={() => {
                                            setSelectedRecipeState(recipe)
                                        }}
                                    />
                                    
                                    {/* Delete button */}
                                    <IconButton
                                        onClick={() => {
                                            deleteRecipe(apiClient, recipe)
                                            refreshRecipes(apiClient)
                                        }}>
                                        <DeleteIcon />
                                    </IconButton>

                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>

                {/* Display the recipe details on the right */}
                <Grid xs={9} m={2}>
                    <Box>
                        {apiClient && selectedRecipe ? displayRecipe(selectedRecipe) : <Alert severity="error">No recipe selected</Alert>}
                    </Box>
                </Grid>

            </Grid>
        </div>
    );
}

export default MyRecipes;
