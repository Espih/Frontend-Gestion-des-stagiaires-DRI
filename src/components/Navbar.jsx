import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './LDGI.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false); // Etat mi-detecte defilement 
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleDashboardClick = () => {
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else if (userRole === 'agent') {
      navigate('/agent-dashboard');
    } else {
      console.warn('Rôle non défini ou invalide:', userRole);
      navigate('/login'); 
    }
  };

  // Détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10; 
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="sticky" 
      sx={{
        backgroundColor: scrolled ? '#099488' : 'rgb(9, 148, 136)', 
        transition: 'background-color 0.3s ease',
        top: 0,
        zIndex: 1000, // Anajanonana ny NAvbar ho ambony foana
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="logo" style={{ height: 50, marginRight: 10 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
              DIRECTION REGIONALE DES IMPOTS
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              HAUTE MATSIATRA
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'white !important', color: 'black !important' }}
            onClick={() => navigate('/rendezvous')}
          >
            Prendre un rendez-vous
          </Button>

          <Button component={Link} to="/" sx={{ color: location.pathname === '/' ? 'yellow' : 'white' }}>
            Accueil
          </Button>
          <Button
            component={Link}
            to="/about"
            sx={{
              color: location.pathname === '/aproposPage' ? 'yellow' : 'white'
            }}
          >
            À propos
          </Button>

          {!isLoggedIn && (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-controls="menu-role"
                aria-haspopup="true"
                onClick={handleMenuClick}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-role"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/login?role=admin'); }}>Admin</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/login?role=agent'); }}>Agents</MenuItem>
              </Menu>
            </>
          )}

          {isLoggedIn && (
            <>
              <Button
                color="inherit"
                onClick={handleDashboardClick}
                sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;