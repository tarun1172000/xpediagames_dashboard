import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme, Drawer, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header"; // Import the Header component
import Blog from "./components/Sidebar/Blog";
import Game from "./components/Sidebar/Game";
import Promo from "./components/Sidebar/Promo";
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from "react-router-dom";
import Store from "./components/Sidebar/Store";
const Layout = () => (
  <Box sx={{ display: "flex" }}>
    <Sidebar />

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "#121212",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Header />
      <Outlet />
    </Box>
  </Box>
);

const App = () => {
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212",
        paper: "#1E1E1E",
      },
      text: {
        primary: "#ffffff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        {/* Define routes */}
        <Routes>
          {/* Route for login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route for dashboard with Sidebar and Header */}
          <Route path="/" element={<Layout />}>
            {/* Nested route for Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/game" element={<Game />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="/store" element={<Store/>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
