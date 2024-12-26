import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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

  const customColor = '#f29c1e';
  const hoverColor = '#632600';

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password, role });
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        right:'50%',
        minHeight: '100vh', // Make sure it takes full viewport height
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        sx={{
          padding: '32px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: 400, // Maximum width of the Paper
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
              width: '80%', // Makes image fill the width of the form
              height: 'auto', // Maintain aspect ratio
              borderRadius: '8px', // Rounded corners for the image
            }}
          />
        </Box>

        {/* Icon and Title in the same line */}
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

            {/* Role Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Role"
                  required
                >
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="blogger">Blogger</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Login Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  backgroundColor: customColor,
                  '&:hover': {
                    backgroundColor: hoverColor,
                  },
                  padding: '12px',
                  fontSize: '16px',
                }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
