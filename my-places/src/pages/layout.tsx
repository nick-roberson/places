import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link, Outlet } from 'react-router-dom';

function Layout() {

    // Define the pages and their routes
    const [pages] = React.useState<string[]>(['Home', 'Places', 'Recipes']);
    const [pages_map] = React.useState<Record<string, string>>({
      'Home': '/home',
      'Places': '/places',
      'Recipes': '/recipes',
    });

    // Handle navigation to the page
    const handleNavToPage = (page: string) => {
        console.log('Navigating to page: ' + page)
        window.location.href = pages_map[page];
    }

    return (
        <>
            <nav>
            <AppBar position="static">
            <Container maxWidth="xl">
            <Toolbar disableGutters>

            <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                Nicks Things
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                    <Button 
                        color="inherit"
                        onClick={() => handleNavToPage(page)}
                    >
                        {page}
                    </Button>
                ))}
            </Box>

            </Toolbar>
            </Container>
        </AppBar>
        </nav>

        <Outlet />

    </>
  );
}
export default Layout;