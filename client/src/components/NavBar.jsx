import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleMobileMenuOpen = () => setMobileMenuOpen(true);
    const handleMobileMenuClose = () => setMobileMenuOpen(false);

    const handleLogout = () => {
        handleCloseUserMenu();
        handleMobileMenuClose();
        logout();
        navigate('/');
    };

    const userInitial = user?.username ? user.username[0].toUpperCase() : '?';

    const isActive = (path) => location.pathname === path;

    const activeButtonStyle = {
        fontWeight: 'bold',
        color: '#A74458',
    };

    const loggedInLinks = [
        { label: "Home", path: "/", showOnDesktop: true },
        { label: "My Account", path: "/account", showOnDesktop: true },
        { label: "Recipes", path: "/recipes", showOnDesktop: true },
        // כפתור Create לא יוצג בדסקטופ כאן, כי הוא מוצג בנפרד
        { label: "Settings", path: "/settings", showOnDesktop: false },
        { label: "Contact", path: "/contact", showOnDesktop: false },
        { label: "Log out", action: handleLogout, showOnDesktop: false },
    ];

    const loggedOutButtons = (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    fontSize: { xs: 12, sm: 14 },
                }}
            >
                Log In
            </Button>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    ml: 1,
                    fontSize: { xs: 12, sm: 14 },
                }}
            >
                Sign Up
            </Button>
        </>
    );

    return (
        <>
            <AppBar position="fixed" color="default" elevation={1}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* לוגו / שם */}
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                color='primary.main'
                                sx={{ fontWeight: 700, cursor: 'pointer', }}
                                onClick={() => navigate('/')}
                            >
                                TastiShare
                            </Typography>
                            {/* כפתורי ניווט בדסקטופ */}
                            {isLoggedIn && (
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 2 }}>
                                    {loggedInLinks
                                        .filter(link => link.showOnDesktop)
                                        .map(link => (
                                            <Button
                                                key={link.label}
                                                color={isActive(link.path) ? "primary" : "secondary"}
                                                onClick={() => navigate(link.path)}
                                                sx={isActive(link.path) ? activeButtonStyle : {}}
                                                variant={isActive(link.path) ? "outlined" : "text"}
                                            >
                                                {link.label}
                                            </Button>
                                        ))}
                                    {user?.role === "admin" && (
                                        <Button
                                            onClick={() => navigate('/admin-dashboard')}
                                            variant='contained'
                                        >
                                            Admin Dashboard
                                        </Button> /// שינוי אדמין לבדיקה
                                    )}
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* כפתור יצירה בדסקטופ */}
                            {isLoggedIn && (
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate('/create')}
                                        sx={{ fontWeight: 'bold', borderRadius: 2 }}
                                    >
                                        + CREATE
                                    </Button>
                                    <Tooltip title="Open user menu">
                                        {user?.avatar ? (
                                            <Avatar
                                                src={`/Avatars/${user.avatar}`}
                                                alt={user.username}
                                                sx={{ cursor: 'pointer' }}
                                                onClick={handleOpenUserMenu}
                                            />
                                        ) : (
                                            <Avatar
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: "#bdbdbd",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                                onClick={handleOpenUserMenu}
                                            >
                                                {userInitial}
                                            </Avatar>
                                        )}
                                    </Tooltip>
                                </Box>
                            )}
                            {/* כפתורי התחברות והרשמה בדסקטופ וטלפון */}
                            {!isLoggedIn && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {loggedOutButtons}
                                </Box>
                            )}
                            {/* שם + אווטאר לא בנייד (הסרתי אותם משורת ה-NAVBAR) */}
                            {/* המבורגר לנייד (הופיע רק כשמשתמש מחובר) */}
                            {isLoggedIn && (
                                <IconButton
                                    color="inherit"
                                    edge="end"
                                    onClick={handleMobileMenuOpen}
                                    sx={{ display: { xs: 'flex', md: 'none' } }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* תפריט המשתמש בדסקטופ */}
            <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    mt: '10px',
                    '& .MuiMenu-paper': {
                        minWidth: 180,
                        borderRadius: 3,
                        p: 0,
                    },
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        fontWeight: 600,
                        color: 'primary.main',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        handleCloseUserMenu();
                        navigate('/account');
                    }}
                >
                    {user?.username || "My Account"}
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}>
                    Settings
                </MenuItem>
                <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/contact'); }}>
                    Contact
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
                    Log out
                </MenuItem>
            </Menu>
            {/* תפריט המבורגר לנייד */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
                PaperProps={{
                    sx: { width: 250, borderRadius: '10px 0 0 10px', p: 2 }
                }}
            >
                {/* כפתור סגירה בתחתית */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <IconButton onClick={handleMobileMenuClose} aria-label="Close menu">
                        <CloseIcon />
                    </IconButton>
                </Box>
                {/* בלוק עם שם ואווטאר למעלה */}
                {isLoggedIn && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 1 }}>
                        {user?.avatar ? (
                            <Avatar
                                src={`/Avatars/${user.avatar}`}
                                alt={user.username}
                                sx={{ width: 40, height: 40 }}
                            />
                        ) : (
                            <Avatar sx={{ width: 40, height: 40, bgcolor: "#bdbdbd", color: "#fff", fontWeight: 700 }}>
                                {userInitial}
                            </Avatar>
                        )}
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user.username}
                        </Typography>
                    </Box>
                )}
                <List>
                    {isLoggedIn && (
                        <>
                            <ListItem
                                button
                                onClick={() => {
                                    navigate('/');
                                    handleMobileMenuClose();
                                }}
                                selected={isActive('/')}
                            >
                                <ListItemText
                                    primary="Home"
                                    sx={isActive('/') ? { color: 'primary.main' } : {}}
                                />
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => {
                                    navigate('/create');
                                    handleMobileMenuClose();
                                }}
                                selected={isActive('/create')}
                            >
                                <ListItemText
                                    primary="Create"
                                    sx={isActive('/create') ? { color: 'primary.main' } : {}}
                                />
                            </ListItem>
                            {user?.role === "admin" && (
                                <ListItem
                                    button
                                    onClick={() => {
                                        navigate('/admin-dashboard');
                                        handleMobileMenuClose();
                                    }}
                                    selected={isActive('/admin-dashboard')}
                                >
                                    <ListItemText
                                        primary="Admin Dashboard"
                                        sx={isActive('/admin-dashboard') ? { color: 'primary.main' } : {}}
                                    />
                                </ListItem> /// שינוי אדמין לבדיקה
                            )}
                            {/* שאר הקישורים פרט ל-Log out */}
                            {loggedInLinks
                                .filter(link => !['Home', 'Log out'].includes(link.label))
                                .map((link) => {
                                    if (link.action) return null;
                                    const selected = isActive(link.path);
                                    return (
                                        <ListItem
                                            button
                                            key={link.label}
                                            onClick={() => {
                                                navigate(link.path);
                                                handleMobileMenuClose();
                                            }}
                                            selected={selected}
                                        >
                                            <ListItemText
                                                primary={link.label}
                                                sx={selected ? { color: 'primary.main' } : {}}
                                            />
                                        </ListItem>
                                    );
                                })}
                            {/* כפתור Log out אדום */}
                            <ListItem
                                button
                                onClick={handleLogout}
                            >
                                <ListItemText primary="Log out" />
                            </ListItem>
                        </>
                    )}
                    {/* אם לא מחוברים - הכפתורים רגילים */}
                    {!isLoggedIn && (
                        <>
                            <ListItem button onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
                                <ListItemText primary="Log In" />
                            </ListItem>
                            <ListItem button onClick={() => { navigate('/register'); handleMobileMenuClose(); }}>
                                <ListItemText primary="Sign Up" />
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>
        </>
    );
};

export default NavBar;
