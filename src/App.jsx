import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import Header from './components/Header'; // Import the Header component

const App = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          
          {/* Define routes */}
          <Routes>
            {/* Route for login page */}
            <Route path="/" element={<LoginPage />} />

            {/* Route for dashboard page, with Header and Sidebar */}
            <Route
              path="/dashboard"
              element={
                <>
                  <Header /> {/* Include Header */}
                  <Box sx={{ display: 'flex' }}>
                    <Sidebar /> {/* Sidebar for the dashboard */}
                  </Box>
                </>
              }
            />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
