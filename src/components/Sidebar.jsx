import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import {
  Home,
  Person,
  Gamepad,
  Storefront,
  LocalOffer,
  TrendingUp,
  Article,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

// Import the xpedia.png image
import xpediaImage from "../assets/xpedia.png"; // Update the path according to your project structure

const Sidebar = () => {
  const theme = useTheme();
  const [activePage, setActivePage] = useState(""); // State to track active page

  const menuItems = [
    { text: "Banner", icon: <Home /> },
    { text: "Blog", icon: <Article /> },
    { text: "Game", icon: <Gamepad /> },
    { text: "Promo", icon: <LocalOffer /> },
    { text: "Store", icon: <Storefront /> },
    { text: "TrendingGame", icon: <TrendingUp /> },
    { text: "User", icon: <Person /> },
  ];

  const customColor = "#f48d4c"; // Base color
  const hoverColor = "#632600"; // Hover color for background
  const darkModeBackground = theme.palette.mode === "dark" ? "black" : "white"; // Dark mode background

  return (
    <Drawer
      sx={{
        width: 320, 
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 320,
          backgroundColor: darkModeBackground,
          color: theme.palette.text.primary,
          padding: "16px",
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
            width: "80%",
            height: 80,
            objectFit: "contain",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        />
      </Box>

      {/* Content with Margin Top */}
      <Box sx={{ mt: 2 }}>
        {/* Menu Items */}
        <List>
  {menuItems.slice(0, 6).map((item, index) => (
    <NavLink
      key={index}
      to={item.text}
      className="sidebarlinks"
      onClick={() => setActivePage(item.text)} // Set active page on click
      style={{
        textDecoration: "none", // Remove default link styling
        width: "100%",
      }}
    >
      <ListItem
        button
        sx={{
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor:
            activePage === item.text ? hoverColor : "transparent", // Highlight active page
          "&:hover": {
            backgroundColor: hoverColor, // Hover effect when not active
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: customColor,
            "&:hover": {
              color: "black",
            },
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{
            color: customColor,
            "&:hover": {
              color: "black", // Text hover effect
            },
          }}
        />
      </ListItem>
    </NavLink>
  ))}

  {/* Divider above the "User" item */}
  <Divider sx={{ borderColor: customColor , marginBottom : "5px"}} />

  <NavLink
    key={6}
    to={menuItems[6].text}
    className="sidebarlinks"
    onClick={() => setActivePage(menuItems[6].text)}
    style={{
      textDecoration: "none",
      width: "100%",
    }}
  >
    <ListItem
      button
      sx={{
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor:
          activePage === menuItems[6].text ? hoverColor : "transparent", // Highlight active page
        "&:hover": {
          backgroundColor: hoverColor, // Hover effect when not active
        },
      }}
    >
      <ListItemIcon
        sx={{
          color: customColor,
          "&:hover": {
            color: "black",
          },
        }}
      >
        {menuItems[6].icon}
      </ListItemIcon>
      <ListItemText
        primary={menuItems[6].text}
        sx={{
          color: customColor,
          "&:hover": {
            color: "black", // Text hover effect
          },
        }}
      />
    </ListItem>
  </NavLink>
</List>

        <Divider sx={{ borderColor: customColor }} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
