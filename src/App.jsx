import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header"; // Import the Header component
import Blog from "./components/Blog/Blog";
import Game from "./components/Sidebar/Game";
import Promo from "./components/Sidebar/Promo";
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from "react-router-dom";
import Store from "./components/Sidebar/Store";
import Banner from "./components/Sidebar/Banner";
import User from "./components/Sidebar/User"
import TrendingGame from "./components/Sidebar/TrendingGame";
import AddBlog from "./components/Blog/AddBlog"; 

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

  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/banner" element={<Banner />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/game" element={<Game />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="/store" element={<Store />} />
            <Route path="/user" element={<User />} />
            <Route path="/trendinggame" element={<TrendingGame />} />
            <Route path="/addBlog" element={<AddBlog />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
