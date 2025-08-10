import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Footer = () => {
    return (
        <AppBar
            position="static"
            color="default"
            elevation={1}
            sx={{ top: 'auto', bottom: 0, bgcolor: '#f5f5f5' }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        py: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                    >
                        &copy; {new Date().getFullYear()} TastiShare. All rights reserved.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {/* <Link
                            component={RouterLink}
                            to="/"
                            color="primary"
                            underline="hover"
                            sx={{ cursor: 'pointer', fontWeight: 600 }}
                        >
                            Home
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/contact"
                            color="primary"
                            underline="hover"
                            sx={{ cursor: 'pointer', fontWeight: 600 }}
                        >
                            Contact
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/settings"
                            color="primary"
                            underline="hover"
                            sx={{ cursor: 'pointer', fontWeight: 600 }}
                        >
                            Settings
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/recipes"
                            color="primary"
                            underline="hover"
                            sx={{ cursor: 'pointer', fontWeight: 600 }}
                        >
                            All Recipes
                        </Link> */}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Footer;
