import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, IconButton, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import xpediaImage from '../assets/xpedia.png';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const customColor = '#f29c1e';
  const hoverColor = '#632600';

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error state
    setError('');
    setOpenSnackbar(false);

    try {
      const response = await fetch('http://api.xpediagames.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`, // if you need to send a bearer token, adjust accordingly
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the access_token to localStorage
        localStorage.setItem('access_token', data.access_token);
        // Navigate to dashboard after successful login
        navigate('/Blog');
      } else {
        // Handle API errors (e.g. invalid login)
        setError(data.message || 'Login failed');
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // Reusable style for form buttons
  const buttonStyles = {
    backgroundColor: customColor,
    '&:hover': {
      backgroundColor: hoverColor,
    },
    padding: '12px',
    fontSize: '16px',
  };

  return (
    <Box
      className="main-box-login"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        sx={{
          padding: '32px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: 400,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 2 }}>
          <img
            src={xpediaImage}
            alt="Xpedia"
            style={{
              width: '80%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </Box>

        {/* Icon and Title */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <IconButton sx={{ backgroundColor: customColor, color: 'white', marginRight: 1 }}>
            <Lock />
          </IconButton>
          <Typography variant="h5" sx={{ color: customColor }}>
            Login
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>

            {/* Login Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={buttonStyles}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Snackbar for error messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={error}
        />
      </Paper>
    </Box>
  );
};

export default LoginPage;
