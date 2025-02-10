import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Snackbar, Alert, FormControlLabel, Checkbox, Typography, Grid, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
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

function AddBlog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    short_desc: '',
    category: '',
    author: '',
    all_data: '',
    banner: '',
    campaign_link: '',
    meta_keyword: '',
    post_data: false,
    trending: false,
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

  // Handle checkbox change for post_data and trending
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Handle change in the rich text editor (All Data)
  const handleEditorChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      all_data: value,
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
      const response = await fetch('https://api.xpediagames.com/api/blog', {
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
        const newBlog = await response.json();
        showSnackbar('Blog added successfully', 'success');
        navigate('/blog');

      } else {
        showSnackbar('Error adding the blog', 'error');
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      showSnackbar('Error adding the blog', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
        <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Add New Blog
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Grid layout for Title and Client Name */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Client Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>

          {/* Other form fields */}
          <TextField
            label="Short Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="short_desc"
            value={formData.short_desc}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Author"
            variant="outlined"
            fullWidth
            margin="normal"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Banner URL"
            variant="outlined"
            fullWidth
            margin="normal"
            name="banner"
            value={formData.banner}
            onChange={handleInputChange}
            sx={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}
          />
          <TextField
            label="Campaign Link"
            variant="outlined"
            fullWidth
            margin="normal"
            name="campaign_link"
            value={formData.campaign_link}
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

          {/* Rich Text Editor for All Data */}
          <ReactQuill
            value={formData.all_data}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                [{ 'align': [] }],
                ['image'],
                ['blockquote'],
                [{ 'direction': 'rtl' }],
              ],
            }}
            theme="snow"
            placeholder="Enter detailed blog content here..."
            style={{
              backgroundColor: 'white',
              height: '500px',
              color: 'black',
              borderRadius: '8px',
              padding: '10px',
            }}
          />

          {/* Checkbox for Post Data and Trending */}
          <FormControlLabel
            control={<Checkbox checked={formData.post_data} onChange={handleCheckboxChange} name="post_data" />}
            label="Post Data"
            sx={{ color: 'text.primary' }}
          />
          <FormControlLabel
            control={<Checkbox checked={formData.trending} onChange={handleCheckboxChange} name="trending" />}
            label="Trending"
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

export default AddBlog;
