// Standard
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Third Party
import Input from '@mui/joy/Input';

import Grid from '@mui/system/Unstable_Grid';

import MenuIcon from '@mui/icons-material/Menu';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
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
import ListItemAvatar from '@mui/material/ListItemAvatar';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

// Complex imports
import { DataGrid, GridToolbar, GridColDef, GridEventListener} from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';

// My imports
import { Configuration } from './api';
import { DefaultApi } from './api/apis';
import { Place } from './api/models/Place';
import fetchApiKey from "./components/google_api_key"

// Function that will open in new tab a link from the param
const renderDetailsButton = (params: any) => {
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: 16 }}
                onClick={() => window.open(params.row.reservation_url, '_blank')}
            >
                Google Lookup
            </Button>
        </strong>
    )
}

const renderCommentsCell = (params: any) => {
    // If comments are present, get the number of comments
    let num_comments = 0
    if (params.row.comments) {
        num_comments = params.row.comments.length
    }
    // Return the button with the number of comments
    return (
        <strong>
            {num_comments} Comments
        </strong>
    )
}

function renderCommentsCards(place: any) {
    // check that place is not null
    if (!place) {
        return <div>No Comments</div>
    }

    // check that comments are not null
    if (!place.comments) {
        return <div>No Comments</div>
    }

    // render the comments
    return (
        <div>
            <List sx={{ maxHeight: '50vh', overflow: 'auto'}}>
                {place.comments.map((comment: any) => (
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
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </List>
        </div>
    )
};


// Define the component
const MyPlaces = () => {

    // Create a state to store the API client
    const [apiClient, setApiClient] = useState<DefaultApi | null>(null);
    const [apiKey, setApiKey] = useState<string>('');

    // Create rows and columns for Data GridColDef
    const [places, setPlaces] = useState<Place[]>([]);
    const [rows, setRows] = useState<Place[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);

    // Create state for new comments and add comment function
    const [newComment, setNewComment] = useState<string>('');
    const addComment = () => {
        console.log('Adding a new comment', newComment);
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

        console.log("Adding comment to place", selectedRow?.placeId, newComment)
        try {
            apiClient.addCommentCommentsAddPost({
                commentInsertModel: {
                    placeId: selectedRow?.placeId,
                    text: newComment,
                }
            }).then((response) => {
                console.log('Added comment', response);
                refreshPlaces(true);
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
                refreshPlaces(true);

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

    // Selected row in the table
    const [selectedRow, setSelectedRow] = useState<Place | null>(null);
    const [message, setMessage] = useState<string>('');
    const rowClickEvent: GridEventListener<'rowClick'> = (
      params, // GridRowParams
      event, // MuiEvent<React.MouseEvent<HTMLElement>>
      details, // GridCallbackDetails
    ) => {
        console.log(`Location "${params.row.name}" clicked`);
        setSelectedRow(params.row);
    };

    // Function to update the search
    const updateSearch = (search: string) => {
        // If we are not searching, show all rows
        if (search === '' || search === null) {
            setRows(places);
            return;
        }

        // Else filter the rows
        console.log('Updating search', search)
        let trimmed_search = search.trim().toLowerCase();

        // Set rows equal to filtered rows
        setRows(rows.filter((row) =>
            (
                row.name !== null &&
                row.name.toLowerCase().includes(trimmed_search)
            )
        ));
    };

    // Initialize your API client with the base URL
    useEffect(() => {
        // Init Client 
        const configuration = new Configuration({
            basePath: "http://localhost:8000",
        });
        const api = new DefaultApi(configuration);
        setApiClient(api);
    }, []); // Run this effect only once

    const refreshPlaces = (force: boolean) => {
        // Wait until the API client is initialized
        if (!apiClient) {
            console.log('API client not initialized yet, not loading')
            return;
        }

        if (!force && places.length > 0) {
            return;
        }

        // Load all places from the API
        apiClient.getAllAllGet().then((new_places: Array<Place>) => {
            console.log('Loading places from API', new_places);
            setPlaces(new_places);
            setRows(new_places);
            setColumns([
                { field: 'name', headerName: 'Name', width: 250},
                { field: 'business_status', headerName: 'Status', width: 130 },
                { field: 'formatted_address', headerName: 'Address', width: 400 },
                { field: 'rating', headerName: 'Avg Rating', width: 100 },
                { field: 'user_ratings_total', headerName: 'Total Ratings', width: 100 },
                { field: 'price_level', headerName: 'Price Level', width: 100 },
                // Add field for link our to google reservations
                { field: 'reservation_url', headerName: 'Reservations', width: 200, renderCell: renderDetailsButton },
                { field: 'comments', headerName: 'Comments', width: 200, renderCell: renderCommentsCell },
            ]);
        });
    };

    // Load all places from API using function
    const loadPlaces = () => {
        // Wait until the API client is initialized
        if (!apiClient) {
            console.log('API client not initialized yet, not loading')
            return;
        }
        if (places.length > 0) {
            return;
        }
        refreshPlaces(false);
    };
    loadPlaces();

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} m={2}>

                   {/* App Bar */}
                   <Grid xs={12}>
                        <AppBar position="static">
                          <Toolbar variant="dense">
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                              <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" component="div">
                              Browse Saved Locations (DataGrid)
                            </Typography>
                          </Toolbar>
                        </AppBar>
                    </Grid>

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

                        <div><h2>Comments</h2></div>

                        <Divider textAlign="center" component="div" >Your comments</Divider>
                        <div>{renderCommentsCards(selectedRow)}</div>

                        <Divider textAlign="center">Add new comment</Divider>
                        <div>
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <Input placeholder="New Comment ..." onChange={(event) => setNewComment(event.target.value)} />
                                </Grid>
                                <Grid xs={6}>
                                    <Button variant="contained" color="primary" onClick={() => addComment()}>Add Comment </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Box>
      </div>
      
    );
};

export default MyPlaces;
