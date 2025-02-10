import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Snackbar, Alert, FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f29c1e', // Accent color
    },
    background: {
      default: 'black', // Dark background
      paper: '#1c0c02', // Paper background for cards
    },
    text: {
      primary: '#f48d4c', // White text
      secondary: '#bbbbbb', // Lighter text
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
});

function AddStore() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    store_name: '',
    store_link: '',
    store_img: '',
    about_store: '',
    term_conditions: '',
    store_live: false,
    meta_keyword: '',
    meta_disc: '',
    meta_title: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error'

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle checkbox change for store_live
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Show Snackbar with message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Handle form submission (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://api.xpediagames.com/api/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          meta_keyword: formData.meta_keyword.split(',').map((keyword) => keyword.trim()),
        }),
      });

      if (response.ok) {
        const newStore = await response.json();
        showSnackbar('Store added successfully', 'success');
        navigate('/store');
        
      } else {
        showSnackbar('Error adding the store', 'error');
      }
    } catch (error) {
      console.error('Error adding store:', error);
      showSnackbar('Error adding the store', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
        <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Add New Store
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Grid layout for Store Name and Store Link */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Store Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="store_name"
                value={formData.store_name}
                onChange={handleInputChange}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Store Link"
                variant="outlined"
                fullWidth
                margin="normal"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>

          {/* Other form fields */}
          <TextField
            label="Store Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            name="store_img"
            value={formData.store_img}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="About Store"
            variant="outlined"
            fullWidth
            margin="normal"
            name="about_store"
            value={formData.about_store}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Terms and Conditions"
            variant="outlined"
            fullWidth
            margin="normal"
            name="term_conditions"
            value={formData.term_conditions}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Meta Keywords"
            variant="outlined"
            fullWidth
            margin="normal"
            name="meta_keyword"
            value={formData.meta_keyword}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Meta Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="meta_disc"
            value={formData.meta_disc}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Meta Title"
            variant="outlined"
            fullWidth
            margin="normal"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />

          {/* Checkbox for Store Live */}
          <FormControlLabel
            control={<Checkbox checked={formData.store_live} onChange={handleCheckboxChange} name="store_live" />}
            label="Store Live"
            sx={{ color: 'text.primary' }}
          />

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                padding: '12px 25px',
                fontSize: '16px',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  backgroundColor: '#f2a800',
                  boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </form>

        {/* Snackbar for success or error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              color: '#f29c1e',
              backgroundColor: 'black',
              border: '1px solid #f29c1e',
              boxShadow: '0px 4px 10px rgba(242, 156, 30, 0.5)',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default AddStore;
