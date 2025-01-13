import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, IconButton, Snackbar, Checkbox, FormControlLabel } from '@mui/material';
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
  const [rememberMe, setRememberMe] = useState(false);

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
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        // Save the access_token to localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('userEmail', email);

        // Optionally remember the credentials if 'Remember Me' is checked
        if (rememberMe) {
          localStorage.setItem('rememberEmail', email);
          localStorage.setItem('rememberPassword', password);  // This is optional, use cautiously
        } else {
          localStorage.removeItem('rememberEmail');
          localStorage.removeItem('rememberPassword');
        }

        // Navigate to dashboard after successful login
        navigate('/blog');
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

  // Load saved email and password (if 'Remember Me' was selected)
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    const savedPassword = localStorage.getItem('rememberPassword');
    
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

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

            {/* Remember Me Checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember Me"
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
