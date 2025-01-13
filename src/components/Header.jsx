import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, TextField, InputAdornment, Menu, MenuItem, Box, Avatar, Badge, Typography, Divider } from '@mui/material';
import { Search, Notifications, Menu as MenuIcon, Mail as MailIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user's email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      setUserInitial(email.charAt(0).toUpperCase()); // Initial from email
    }
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('userEmail'); 
    navigate('/login'); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiMenu-paper': {
          backgroundColor: 'black', 
          borderRadius: '8px',
          width: '220px',
          border: "2px solid #f29c1e "
        },
      }}
    >
      <MenuItem sx={{ textAlign: 'center', color: '#f29c1e' }}>
        {userEmail}
      </MenuItem>
      <Divider sx={{ my: 1, backgroundColor: '#f29c1e' }} />
      <MenuItem onClick={handleSignOut} sx={{ color: '#f29c1e' }} >
        Log Out
      </MenuItem>
    </Menu>
  );

  // Mobile Menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'black', color: 'black', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Side: Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Center: Search Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#f29c1e' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: 'black',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#f29c1e',
                  },
                },
                color: '#fff',
                width: '70%',
                marginLeft: '40px',
              }}
            />
          </Box>

          {/* Right Side: Notifications & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ marginRight: 2 }}>
              <Badge badgeContent={4} color="error">
                <MailIcon sx={{ color: '#f29c1e' }} />
              </Badge>
            </IconButton>

            <IconButton color="inherit" sx={{ marginRight: 2 }}>
              <Badge badgeContent={17} color="error">
                <Notifications sx={{ color: '#f29c1e' }} />
              </Badge>
            </IconButton>

            {/* Avatar and Email for Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: '#f29c1e', marginRight: 1 }}>
                {userInitial || 'U'}
              </Avatar>

            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;
