// Standard
import React, { useState, useEffect } from 'react';
import '../App.css';

// Third Party
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
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

// Complex imports
import { DataGrid, GridToolbar, GridColDef, GridEventListener } from '@mui/x-data-grid';

// My imports
import { DefaultApi } from '../api/apis';
import { Place } from '../api/models/Place';
import { CommentsModel } from '../api/models/CommentsModel';
import getAPIClient from './components/api_client';
import { TypeFormatFlags } from 'typescript';

const renderSearchIcon = (params: any) => {
    // Render the search Icon in the table
    let place = params.row
    return (
        <IconButton edge="end" aria-label="search">
            <SearchIcon
                onClick={() => {
                    console.log('Searching for', place.name)
                    window.open(place.reservationUrl, '_blank');
                }
                }
            />
        </IconButton>
    )
}

const renderDeleteIcon = (params: any) => {
    let place = params.row
    // Render the delete Icon in the table
    return (
        <strong>
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon
                    onClick={() => {
                        console.log('Deleting', place.name)
                        const apiClient = getAPIClient();
                        try {
                            const body = { placeId: '', name: place.name }
                            apiClient.deleteDeletePost(body).then((response) => {
                                console.log('Deleted place', response);
                            });
                        } catch (error) {
                            console.error('Error deleting place', error);
                        }
                    }
                }
                />
            </IconButton>
        </strong>
    )
}

function renderCommentsCards(comments: CommentsModel | null) {
    console.log('Calling renderCommentsCards on: ', comments)

    // check that place is not null
    if (!comments) {
        return <div>No Comments</div>
    }

    // check that comments are not null
    if (!comments.comments) {
        return <div>No Comments</div>
    }

    // shorten the created at date for all comments 
    comments.comments.forEach((comment: any) => {
        comment.created_at = comment.created_at.substring(0, 10);
    });

    // render the comments
    return (
        <div>
            <List sx={{ maxHeight: '50vh', overflow: 'auto'}}>
                {comments.comments.map((comment: any) => (
                    <div>
                        <ListItem alignItems="flex-start">

                            <ListItemText
                                primary={comment.created_at}
                                secondary={
                                    <React.Fragment>
                                        {comment.text}
                                    </React.Fragment>
                                }
                            />

                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon 
                                    onClick={() => {
                                        console.log('Deleting comment', comment.comment_id)
                                        const apiClient = getAPIClient();
                                        try {
                                            apiClient.deleteCommentCommentsDeletePost({commentId: comment.comment_id}).then((response) => {
                                                console.log('Deleted comment', response);
                                            });
                                        } catch (error) {
                                            console.error('Error deleting comment', error);
                                        }
                                    }
                                }
                                />
                            </IconButton>

                        </ListItem>
                    </div>
                ))}
            </List>
        </div>
    )
};

const renderSelectedPlace = (place: Place) => {
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
                <ListItemText primary="Name" secondary={place.name} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Address" secondary={place.formattedAddress} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Business Status" secondary={place.businessStatus} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Rating" secondary={place.rating?.toString()} />
            </ListItem>
        </List>
    )
}


// Define the component
const MyPlaces = () => {

    // Create a state to store the API client
    const [apiClient, setApiClient] = useState<DefaultApi | null>(null);

    // Create a state to store the message
    const [message, setMessage] = useState<string>('');

    // Create rows and columns for Data GridColDef
    const [places, setPlaces] = useState<Place[]>([]);
    const [rows, setRows] = useState<Place[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);

    // Selected row in the table
    const [selectedRow, setSelectedRow] = useState<Place | null>(null);
    const [loadedComments, setLoadedComments] = useState<CommentsModel>({comments: []});

    // Create state for new comments and add comment function
    const [newComment, setNewComment] = useState<string>('');
    const addComment = () => {

        // Check that the API client is initialized and a place is selected
        if (!apiClient) {
            console.log('API client not initialized yet, not adding');
            return;
        }
        if (!selectedRow) {
            console.log('No place selected, not adding');
            return;
        }
        if (newComment === '') {
            console.log('No comment entered, not adding');
            return;
        }

        // Add new comment
        console.log("Adding comment to place", selectedRow.id, newComment)
        try {
            apiClient.addCommentCommentsAddPost({
                commentInsertModel: {
                    placeId: selectedRow.id,
                    text: newComment,
                }
            }).then((response) => {
                // Log the response and reload the comments
                console.log('Added comment', response);
                apiClient.getCommentsCommentsGetGet({placeId: selectedRow.id}).then((comments: CommentsModel) => {
                    console.log('Loaded comments', comments);
                    setLoadedComments(comments);
                });
            });
        } catch (error) {
            console.error('Error adding comment', error);
            setMessage('Error adding comment');
        }
    };

    // vars and functions for adding new places
    const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);
    const [newPlaceName, setNewPlaceName] = useState<string>('');
    const [newPlaceLocation, setNewPlaceLocation] = useState<string>('');

    const addPlace = () => {
        console.log('Adding a new place', newPlaceName, newPlaceLocation);
        if (!apiClient) {
            console.log('API client not initialized yet, not adding');
            return;
        }
        try {
            apiClient.addAddPostRaw({ name: newPlaceName, location: newPlaceLocation }).then((response) => {
                console.log('Added place', response);
                refreshPlaces(true, apiClient);

                // Clear the input fields
                setNewPlaceName('');
                setNewPlaceLocation('');

                // Collapse the accordion
                setAccordionExpanded(false);
            });
        } catch (error) {
            console.error('Error adding place', error);
            setMessage('Error adding place');
        }
    };

    const rowClickEvent: GridEventListener<'rowClick'> = (
      params, // GridRowParams
      event, // MuiEvent<React.MouseEvent<HTMLElement>>
      details, // GridCallbackDetails
    ) => {
        // Set the selected row
        console.log(`Location "${params.row.name}" clicked`);
        setSelectedRow(params.row);
        
        // Load the comments 
        if (!apiClient) {
            console.log('API client not initialized yet, not loading comments')
            return;
        }
        if (!params.row.id) {
            console.log('No place selected, not loading comments')
            return;
        }
        apiClient.getCommentsCommentsGetGet({placeId: params.row.id}).then((comments: CommentsModel) => {
            console.log('Loaded comments', comments);
            setLoadedComments(comments);
        });

    };

    // Function to update the search
    const updateSearch = (search: string) => {
        // If we are not searching, show all rows
        if (search === '' || search === null) {
            setRows(places);
            return;
        }
        console.log('Updating search', search)
        let trimmed_search = search.trim().toLowerCase();

        // Set rows equal to filtered rows
        setRows(rows.filter((row) =>
            (
                (
                    row.name !== null &&
                    row.name.toLowerCase().includes(trimmed_search)
                )
                ||
                (
                    row.formattedAddress !== null &&
                    row.formattedAddress.toLowerCase().includes(trimmed_search)
                )
            )
        ));
    };

    // Initialize your API client with the base URL
    useEffect(() => {
        let apiClient = getAPIClient();
        setApiClient(apiClient);
        refreshPlaces(true, apiClient);
    }, []); 

    // Function to refresh places
    const refreshPlaces = (force: boolean, apiClient: DefaultApi) => {
        if (!force && places.length > 0) {
            return;
        }
        // Load all places from the API
        apiClient.getAllAllGet({force: true}).then((new_places: Array<Place>) => {
            console.log('Loading places from API', new_places);

            // Set the places and rows
            setPlaces(new_places);
            setRows(new_places);

            // Set the columns
            setColumns([
                // Add fields for basic information
                { field: 'name', headerName: 'Name', width: 250},
                { field: 'businessStatus', headerName: 'Status', width: 150 },
                { field: 'formattedAddress', headerName: 'Address', width: 400 },
                { field: 'rating', headerName: 'Avg Rating', width: 100 },
                { field: 'userRatingsTotal', headerName: 'Total Ratings', width: 100 },
                { field: 'priceLevel', headerName: 'Price', width: 100 },
                // Add field for link our to google reservations
                { field: 'reservation_url', headerName: 'Search', width: 100, renderCell: renderSearchIcon },
                // Add field for delete button
                { field: 'delete', headerName: 'Delete', width: 100, renderCell: renderDeleteIcon },
            ]);

            // Set the selected row to the first row
            if (new_places.length > 0) {
                setSelectedRow(new_places[0]);
            }
        });
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} m={2}>

                    {/* Dialog for adding places */}
                    <Grid xs={4}>
                        <Accordion
                            expanded={accordionExpanded}
                            onChange={(event, expanded) => setAccordionExpanded(expanded)}
                        >
                            <AccordionSummary
                                expandIcon={<MenuIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Add a new place</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} m={2}>
                                    <Grid xs={12}>
                                        Enter the name of the place you want to add!
                                    </Grid>
                                    <Grid xs={6}>
                                        <Input placeholder="Type name ..." onChange={(event) => setNewPlaceName(event.target.value)} />
                                    </Grid>
                                    <Grid xs={6}>
                                        <Input placeholder="Type location ..." onChange={(event) => setNewPlaceLocation(event.target.value)} />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Button variant="contained" color="primary" onClick={() => addPlace()}>Add Place </Button>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    {/* Display message */}
                    <Grid xs={4}>
                        <Alert severity="info">
                            <strong>Selected Location:</strong> {selectedRow ? selectedRow.name : 'None'}
                        </Alert>
                    </Grid>

                    {/* Display message */}
                    <Grid xs={4}>
                        <Alert severity="info">
                            <strong>API Status:</strong> {apiClient ? 'Connected' : 'Not connected'}
                        </Alert>
                    </Grid>

                    {/* Input text bar for searching and filtering */}
                    <Grid xs={12}>
                        <Input 
                            placeholder="Search by name and location here ..." 
                            onChange={(event) => updateSearch(event.target.value)}
                        />
                    </Grid>

                    {/* DataGrid of all places pull from API */}
                    <Grid xs={9}>
                        <DataGrid
                            onRowClick={rowClickEvent}
                            rows={rows}
                            columns={columns}
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
                        <Grid xs={3}>
                        { selectedRow ?
                            <div>
                                <Divider textAlign="center">Information</Divider>
                                { renderSelectedPlace(selectedRow) }
                                <Divider textAlign="center" component="div" >Your comments</Divider>
                                { renderCommentsCards(loadedComments) }
                                <Divider textAlign="center">Add new comment</Divider>
                                <div>
                                    <Grid container spacing={2} m={2}>
                                        <Grid xs={9}>
                                            <Input placeholder="New Comment ..." onChange={(event) => setNewComment(event.target.value)} />
                                        </Grid>
                                        <Grid xs={3}>
                                            <Button variant="contained" color="primary" onClick={() => addComment()}>Add</Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                            : <Typography>Select a place to view information!</Typography>
                        }
                        </Grid>
                </Grid>
            </Box>
      </div>
      
    );
};

export default MyPlaces;
