import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import Blog from "./components/Blog/Blog";
import Game from "./components/Sidebar/Game";
import Promo from "./components/Sidebar/Promo";
import { Outlet } from "react-router-dom";
import Store from "./components/Store/Store";
import Banner from "./components/Banner/Banner";
import User from "./components/Sidebar/User";
import TrendingGame from "./components/Sidebar/TrendingGame";
import AddBlog from "./components/Blog/AddBlog";
import AddStore from "./components/Store/AddStore";

// PrivateRoute component to handle access control
const PrivateRoute = ({ element }) => {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    return <Navigate to="/login" replace />; // Redirect to /login if no access token
  }

  return element;
};

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
        <Routes>
          {/* Login page route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protecting routes with PrivateRoute */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<PrivateRoute element={<Blog />} />} /> {/* Home route */}
            <Route path="/banner" element={<PrivateRoute element={<Banner />} />} />
            <Route path="/blog" element={<PrivateRoute element={<Blog />} />} />
            <Route path="/game" element={<PrivateRoute element={<Game />} />} />
            <Route path="/promo" element={<PrivateRoute element={<Promo />} />} />
            <Route path="/store" element={<PrivateRoute element={<Store />} />} />
            <Route path="/user" element={<PrivateRoute element={<User />} />} />
            <Route path="/trendinggame" element={<PrivateRoute element={<TrendingGame />} />} />
            <Route path="/addBlog" element={<PrivateRoute element={<AddBlog />} />} />
            <Route path="/addStore" element={<PrivateRoute element={<AddStore />} />} />
          </Route>

          {/* Redirect undefined routes to login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
