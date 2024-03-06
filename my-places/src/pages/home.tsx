// Simple home page
import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

export function Home() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <h1>Welcome to My Places</h1>
      <p>
        To get started, click on one of the links below.
      </p>
      <p>
        <Link to="/places">Places Page</Link>
      </p>
      <p>
        <Link to="/recipes">Recipes Page</Link>
      </p>
    </Box> 
  );
}

export default Home;
