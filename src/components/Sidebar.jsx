import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Box } from '@mui/material';
import { Home, Bookmark, Person, Gamepad, Storefront, LocalOffer, TrendingUp, Article, Close, Add, Edit, Delete, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import CreateBanner from '../components/Banner/CreateBanner';

// Import the xpedia.png image
import xpediaImage from '../assets/xpedia.png'; // Update the path according to your project structure

const Sidebar = () => {
  const theme = useTheme();
  const [bannerOpen, setBannerOpen] = useState(false); // state to handle the "Banner" section toggling
  const [activePage, setActivePage] = useState(''); // State to track active page

  const menuItems = [
    { text: 'Banner', icon: <Home /> }, // Main Banner item
    { text: 'Blog', icon: <Article /> },
    { text: 'Game', icon: <Gamepad /> },
    { text: 'Promo', icon: <LocalOffer /> },
    { text: 'Store', icon: <Storefront /> },
    { text: 'Test', icon: <Bookmark /> },
    { text: 'Trending Game', icon: <TrendingUp /> },
    { text: 'Users', icon: <Person /> },  // Using Material-UI Person icon for "Users"
  ];

  const customColor = '#f48d4c'; // Base color
  const hoverColor = '#632600';  // Hover color for background
  const darkModeBackground = theme.palette.mode === 'dark' ? 'black' : 'white'; // Dark mode background

  // Handler for actions
  const handleBannerAction = (action) => {
    switch (action) {
      case 'create':
        setActivePage('createBanner'); // Switch to CreateBanner page
        break;
      case 'update':
        console.log('Update Banner action triggered');
        break;
      case 'delete':
        console.log('Delete Banner action triggered');
        break;
      default:
        console.log('Unknown action');
    }
  };

  return (
    <>
      {/* Render CreateBanner component if the activePage is 'createBanner' */}
      {activePage === 'createBanner' ? (
        <CreateBanner />
      ) : (
        <Drawer
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              backgroundColor: darkModeBackground,
              color: theme.palette.text.primary,
              borderRadius: '16px',
              padding: '16px',
            },
          }}
          variant="permanent" // Make the drawer always open
          anchor="left"
        >
          {/* Image at the top of the sidebar */}
          <Box sx={{ mb: 2 }}>
            <img
              src={xpediaImage}
              alt="Xpedia"
              style={{
                width: '80%',
                height: 'auto',
                borderRadius: '8px',
                marginTop: '10px',
              }}
            />
          </Box>

          {/* Content with Margin Top */}
          <Box sx={{ mt: 2 }}>
            {/* Menu Items */}
            <List>
              {menuItems.map((item, index) => (
                <div key={index}>
                  {/* Banner item with sub-menu */}
                  {item.text === 'Banner' ? (
                    <ListItem
                      button
                      onClick={() => setBannerOpen(!bannerOpen)} // Toggle banner options
                      sx={{
                        '&:hover': {
                          backgroundColor: hoverColor, // Hover color for list item background
                        },
                        padding: '12px 16px',
                        borderRadius: '8px',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: customColor,
                          '&:hover': {
                            color: 'black',
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          color: customColor,
                        }}
                      />
                      {/* Toggle caret icon below the "Banner" icon */}
                      {bannerOpen ? (
                        <ArrowDropUp sx={{ color: customColor, marginLeft: '20px' }} />  // Up caret when open
                      ) : (
                        <ArrowDropDown sx={{ color: customColor, marginLeft: '20px' }} />  // Down caret when closed
                      )}
                    </ListItem>
                  ) : (
                    // Regular menu items
                    <ListItem
                      button
                      sx={{
                        '&:hover': {
                          backgroundColor: hoverColor,
                        },
                        padding: '12px 16px',
                        borderRadius: '8px',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: customColor,
                          '&:hover': {
                            color: 'black',
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          color: customColor,
                        }}
                      />
                    </ListItem>
                  )}

                  {/* Banner actions dropdown (only visible when 'Banner' is clicked) */}
                  {bannerOpen && item.text === 'Banner' && (
                    <div>
                      <ListItem
                        button
                        onClick={() => handleBannerAction('create')}
                        sx={{
                          paddingLeft: '40px', // Indent for sub-menu
                          '&:hover': {
                            backgroundColor: hoverColor, // Same hover effect as the other menu items
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: customColor,
                            '&:hover': {
                              color: 'black',
                            },
                          }}
                        >
                          <Add />
                        </ListItemIcon>
                        <ListItemText
                          primary="Create New Banner"
                          sx={{
                            color: customColor,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => handleBannerAction('update')}
                        sx={{
                          paddingLeft: '40px',
                          '&:hover': {
                            backgroundColor: hoverColor,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: customColor,
                            '&:hover': {
                              color: 'black',
                            },
                          }}
                        >
                          <Edit />
                        </ListItemIcon>
                        <ListItemText
                          primary="Update Banner"
                          sx={{
                            color: customColor,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => handleBannerAction('delete')}
                        sx={{
                          paddingLeft: '40px',
                          '&:hover': {
                            backgroundColor: hoverColor,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: customColor,
                            '&:hover': {
                              color: 'black',
                            },
                          }}
                        >
                          <Delete />
                        </ListItemIcon>
                        <ListItemText
                          primary="Delete Banner"
                          sx={{
                            color: customColor,
                          }}
                        />
                      </ListItem>
                    </div>
                  )}
                </div>
              ))}
            </List>
            <Divider sx={{ borderColor: customColor }} />
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
