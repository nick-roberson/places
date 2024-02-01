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
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

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
                onClick={() => window.open(params.row.reservationUrl, '_blank')}
            >
                Google Lookup
            </Button>
        </strong>
    )
}

function RenderBarChart(places: Place[], dataKey: string, chartLabel: string) {
    if (places.length === 0) {
        return <div>No places to display</div>;
    }

    // Filter out places with missing rating or price priceLevel
    places = places.filter((place) => place.rating && place.priceLevel);

    // Create a dataset for the bar chart
    const dataset = places.map((place) => {
        return {
            name: place.name,
            rating: place.rating,
            userRatingsTotal: place.userRatingsTotal,
        };
    });

    const valueFormatter = (value: number) => `${value}`;

    // order bars by rating
    return (
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'name', label: 'Name' }]}
          series={[
            { dataKey: dataKey,  label: chartLabel, valueFormatter },
          ]}
        />
    );
}

// Define the component
const MyPlaces = () => {

    // Create a state to store the API client
    const [apiClient, setApiClient] = useState<DefaultApi | null>(null);
    const [apiKey, setApiKey] = useState<string>('');

    // Create rows and columns for Data GridColDef
    const [places, setPlaces] = useState<Place[]>([]);
    const [rows, setRows] = useState<Place[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);

    // vars and functions for adding new places
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
            });
        } catch (error) {
            console.error('Error adding place', error);
            setMessage('Error adding place');
        }
    };

    // Selected row in the table
    const [selectedRow, setSelectedRow] = useState<Place | null>(null);
    const [message, setMessage] = useState<string>('');
    const handleEvent: GridEventListener<'rowClick'> = (
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
        if (search === '') {
            setRows(places);
            return;
        }

        // Else filter the rows
        const new_rows = rows.filter((row) =>
            row.name.toLowerCase().includes(search.toLowerCase())
            || row.formattedAddress.toLowerCase().includes(search.toLowerCase())
        );
        setRows(new_rows);
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
                { field: 'businessStatus', headerName: 'Status', width: 130 },
                { field: 'formattedAddress', headerName: 'Address', width: 400 },
                { field: 'rating', headerName: 'Avg Rating', width: 100 },
                { field: 'userRatingsTotal', headerName: 'Total Ratings', width: 100 },
                { field: 'priceLevel', headerName: 'Price Level', width: 100 },
                // Add field for link our to google reservations
                { field: 'reservationUrl', headerName: 'Reservations', width: 200, renderCell: renderDetailsButton },
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
                        <Accordion>
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
                        <Input placeholder="Search by name and location here ..." onChange={(event) => updateSearch(event.target.value)} />
                    </Grid>
                    {/* DataGrid of all places pull from API */}
                    <Grid xs={9}>
                        <DataGrid
                            onRowClick={handleEvent}
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
                        {RenderBarChart(rows, 'rating', 'Rating')}
                    </Grid>
                </Grid>
            </Box>
      </div>
      
    );
};

export default MyPlaces;
