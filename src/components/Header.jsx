import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, TextField, InputAdornment, Menu, MenuItem, Box, Avatar, Badge } from '@mui/material';
import { Search, Notifications, AccountCircle, ExitToApp, Menu as MenuIcon, Mail as MailIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    // Handle sign-out logic (e.g., clearing tokens, redirecting to login)
    console.log('Sign out');
    navigate('/login'); // Redirect to login page after sign-out
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const menuId = 'profile-menu';
  const mobileMenuId = 'mobile-menu';

  // Profile Menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <AccountCircle sx={{ marginRight: 1 }} /> Profile
      </MenuItem>
      <MenuItem onClick={handleSignOut}>
        <ExitToApp sx={{ marginRight: 1 }} /> Sign Out
      </MenuItem>
    </Menu>
  );

  // Mobile Menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
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
            <Notifications sx={{ color: '#f29c1e' }} />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" aria-label="account of current user" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'black', color: 'black', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Side: Menu & Search Bar */}
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

            {/* Search Bar */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1 }}>
              <TextField
                fullWidth
                
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
                  marginLeft: '40px',
                }}
              />
            </Box>
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

            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: '#f29c1e'  }}>S</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;
