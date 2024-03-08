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
import Tooltip from '@mui/material/Tooltip';

// My imports
import getAPIClient from './components/api_client';
import { DefaultApi } from '../api/apis';
import { RecipeModel } from '../api';
import { Ingredient, IngredientFromJSON } from '../api';
import { Instruction, InstructionFromJSON } from '../api';
import { Note, NoteFromJSON } from '../api';
import { Divider, IconButton } from '@mui/material';

// Recipe Manager 
import RecipeManager from './components/recipe_manager';
import { Link } from 'react-router-dom';
import strict from 'assert/strict';

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
    { field: 'preparation', headerName: 'Prep', width: 200, editable: true, renderCell: (params: any) =>  (
        <Tooltip title={params.value} arrow>
            <p>{params.value}</p>
        </Tooltip>
       ),
    },
    { field: 'delete', headerName: 'Delete', width: 100, renderCell: renderDeleteIngredient},
];

const instructionCols: GridColDef[] = [
    { field: 'step', headerName: 'Step', width: 75, editable: true },
    { field: 'description', headerName: 'Description', width: 925, editable: true, renderCell: (params: any) =>  (
        <Tooltip title={params.value} arrow>
            <p>{params.value}</p>
        </Tooltip>
       ),
    },
    { field: 'delete', headerName: 'Delete', width: 100, renderCell: renderDeleteInstruction},
];

const noteCols: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150, editable: true },
    { field: 'body', headerName: 'Body', width: 350, editable: true, renderCell: (params: any) =>  (
        <Tooltip title={params.value} arrow>
            <p>{params.value}</p>
        </Tooltip>
       ),
    },
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
            step: instruction.step,
            description: instruction.description,
        };
    });
}

const createNoteRowsFromRecipe = (recipe: RecipeModel) => {
    return recipe.notes?.map((note: Note) => {
        return {
            id: note.id,
            title: note.title,
            body: note.body,
        };
    });
}

const MutateIngredientRowCallback = () => {
    return React.useCallback(
      (recipeManager: RecipeManager, ingredient: Ingredient) =>
        new Promise<Ingredient>((resolve, reject) => {
          setTimeout(() => {
            recipeManager.updateIngredient(ingredient);
            resolve({ ...ingredient });
          }, 200);
        }),
      [],
    );
};

const MutateInstructionRowCallback = () => {
    return React.useCallback(
      (recipeManager: RecipeManager, instruction: Instruction) =>
        new Promise<Instruction>((resolve, reject) => {
          setTimeout(() => {
            recipeManager.updateInstruction(instruction);
            resolve({ ...instruction });
          }, 200);
        }),
      [],
    );
}

const MutateNoteRowCallback = () => {
    return React.useCallback(
      (recipeManager: RecipeManager, note: Note) =>
        new Promise<Note>((resolve, reject) => {
          setTimeout(() => {
            console.log('Updating note', note)
            recipeManager.updateNote(note);
            resolve({ ...note });
          }, 200);
        }),
      [],
    );
}

export function MyRecipes() {

    // constants
    const [apiClient, setApiClient] = React.useState<DefaultApi>(getAPIClient());

    // variables for all recipes
    let [allRecipes, setAllRecipes] = React.useState<RecipeModel[] | null>(null);

    // Create rows for the ingredient, instruction, and note DataGrids
    let [ingredientRows, setIngredientRows] = React.useState([]);
    let [instructionRows, setInstructionRows] = React.useState([]);
    let [noteRows, setNoteRows] = React.useState([]);

    // variables for current recipe manager and reference
    let [currentRecipeManager, setCurrentRecipeManager] = React.useState<RecipeManager | null>(null);
    let currentRecipeManagerRef = useRef(currentRecipeManager);
    const updateCurrentRecipe = (recipe: RecipeModel) => {
        // create new manager
        const newRecipeManager = new RecipeManager(recipe);
        // update current manager
        setCurrentRecipeManager(newRecipeManager);
        currentRecipeManagerRef.current = newRecipeManager;
        // update rows 
        setInstructionRows(createInstructionRowsFromRecipe(recipe));
        setIngredientRows(createIngredientRowsFromRecipe(recipe));
        setNoteRows(createNoteRowsFromRecipe(recipe));
    }

    // initialze variables for all and selected recipe
    useEffect(() => {
        getRecipes(apiClient).then((recipes) => {
            setAllRecipes(recipes);
            if (recipes.length > 0) {
                let first_recipe = recipes[0];
                updateCurrentRecipe(first_recipe);
            } else {
                setCurrentRecipeManager(null);
            }
        });
    }, []);

    // Re-initialze variables for all and selected recipe
    const refreshRecipes = async (apiClient: DefaultApi) => {
        getRecipes(apiClient).then((recipes) => {
            setAllRecipes(recipes);
            if (recipes.length > 0) {
                let first_recipe = recipes[0];
                updateCurrentRecipe(first_recipe);
            } else {
                setCurrentRecipeManager(null);
            }
        });
    }

    // Dialog state
    const theme = useTheme();
    let [open, setOpen] = React.useState(false);
    let fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleDialogCreate = async () => {
        const response = await apiClient.addRecipeRecipesAddPost({ recipeModel: {
            name: newRecipeName,
            description: newRecipeDescription,
            source: newRecipeSource,
        } });
        handleDialogClose();
    }
    const handleDialogClose = () => {
      setOpen(false);
    };

    // Dialog for adding a new recipe
    let [newRecipeName, setNewRecipeName] = React.useState("");
    let [newRecipeDescription, setNewRecipeDescription] = React.useState("");
    let [newRecipeSource, setNewRecipeSource] = React.useState("");

    // Create function to add a row to the Ingredients DataGrid
    const addIngredientRow = async () => {
        if (!currentRecipeManager) {
            throw new Error("No Recipe Manager");
        }
        const new_ingredient = IngredientFromJSON({
            id: Math.floor(Math.random() * 1000000).toString(),
            name: "",
            quantity: "",
            measurement: "",
            preparation: "",
        });
        currentRecipeManager.addIngredient(new_ingredient);
        setIngredientRows(createIngredientRowsFromRecipe(currentRecipeManager.recipe));
    }

    // Create function to add a row to the Instructions DataGrid
    const addInstructionRow = async () => {
        if (!currentRecipeManager) {
            throw new Error("No Recipe Manager");
        }
        const new_instruction = InstructionFromJSON({
            id: Math.floor(Math.random() * 1000000).toString(),
            step: "",
            description: "",
        });
        currentRecipeManager.addInstruction(new_instruction);
        setInstructionRows(createInstructionRowsFromRecipe(currentRecipeManager.recipe));
    }

    // Create function to add a row to the Notes DataGrid
    const addNoteRow = async () => {
        if (!currentRecipeManager) {
            throw new Error("No Recipe Manager");
        }
        const new_note = NoteFromJSON({
            id: Math.floor(Math.random() * 1000000).toString(),
            title: "",
            body: "",
        });
        currentRecipeManager.addNote(new_note);
        setNoteRows(createNoteRowsFromRecipe(currentRecipeManager.recipe));
    }

    // Update when an ingredient row is changed
    const mutateIngredientRow = MutateIngredientRowCallback();
    const processIngredientRowUpdate = React.useCallback(
        async (newRow: Ingredient, oldRow: Ingredient) => {
            const recipeManager = currentRecipeManagerRef.current;
            if (!recipeManager) {
                throw new Error("No selected recipe");
            }
            return await mutateIngredientRow(recipeManager, newRow);
        },
        [mutateIngredientRow],
    );

    // Update when an instruction row is changed
    const mutateInstructionRow = MutateInstructionRowCallback();
    const processInstructionRowUpdate = React.useCallback(
        async (newRow: Instruction, oldRow: Instruction) => {
            const recipeManager = currentRecipeManagerRef.current;
            if (!recipeManager) {
                throw new Error("No selected recipe");
            }
            return await mutateInstructionRow(recipeManager, newRow);
        },
        [mutateInstructionRow],
    );

    // Update when a note row is changed 
    const mutateNoteRow = MutateNoteRowCallback();
    const processNoteRowUpdate = React.useCallback(
        async (newRow: Note, oldRow: Note) => {
            const recipeManager = currentRecipeManagerRef.current;
            if (!recipeManager) {
                throw new Error("No selected recipe");
            }
            return await mutateNoteRow(recipeManager, newRow);
        },
        [mutateNoteRow],
    );

    // Error handling
    const handleProcessRowUpdateError = React.useCallback((error: Error) => {
        console.error(error);
    }, []);
    
    
    const displayRecipe = (recipeManager: RecipeManager) => {
        return (
            <div>
                <Alert severity="info">Recipe selected: {recipeManager.recipe.name}</Alert>
                <p> 
                    <strong>Description: </strong> 
                    <p>{recipeManager.recipe.description} </p>
                </p>
                <p> 
                    <strong>Source: </strong> {
                        recipeManager.recipe.source && recipeManager.recipe.source.toString().startsWith("http") ?
                        <p><a href={recipeManager.recipe.source.toString()} target="_blank" rel="noreferrer">{recipeManager.recipe.source.toString()}</a></p> :
                        <p>{recipeManager.recipe.source?.toString()}</p>
                    }
                </p>

                <Divider textAlign='left'><h3>Ingredients + Notes </h3></Divider>
                <Grid container spacing={2} xs={12}>
                    <Grid xs={6}>
                        <Button color="primary" onClick={addIngredientRow}><strong>Add Ingredient</strong></Button>
                        {
                            recipeManager.recipe.ingredients && recipeManager.recipe.ingredients?.length > 0 ? (
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
                            recipeManager.recipe.notes && recipeManager.recipe.notes?.length > 0 ? (
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
                    recipeManager.recipe.instructions && recipeManager.recipe.instructions?.length > 0 ? (
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
                                            setCurrentRecipeManager(new RecipeManager(recipe));
                                            currentRecipeManagerRef.current = new RecipeManager(recipe);
                                            setInstructionRows(createInstructionRowsFromRecipe(recipe));
                                            setIngredientRows(createIngredientRowsFromRecipe(recipe));
                                            setNoteRows(createNoteRowsFromRecipe(recipe));
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
                        {apiClient && currentRecipeManager ? displayRecipe(currentRecipeManager) : <Alert severity="error">No recipe selected</Alert>}
                    </Box>
                </Grid>

            </Grid>
        </div>
    );
}

export default MyRecipes;
