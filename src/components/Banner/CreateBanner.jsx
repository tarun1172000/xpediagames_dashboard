import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AddAPhoto } from '@mui/icons-material';

export default function CreateBanner() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    bannerImg: '',
    storeLink: '',
    storeName: ''
  });
  const [imagePreview, setImagePreview] = useState(null); // to show the image preview

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        bannerImg: file
      });
      setImagePreview(URL.createObjectURL(file)); // to show image preview
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form Submitted:', formData);
    alert('Banner created successfully!');
    // Reset form
    setFormData({
      bannerImg: '',
      storeLink: '',
      storeName: ''
    });
    setImagePreview(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '12px',
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Create New Banner
      </Typography>

      <Paper sx={{ padding: 3, borderRadius: 2 }} elevation={3}>
        <form onSubmit={handleSubmit}>
          {/* Banner Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>Banner Image</Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                textTransform: 'none',
                padding: '10px 20px',
                backgroundColor: theme.palette.secondary.main,
                color: '#fff',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              <AddAPhoto sx={{ mr: 1 }} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Image Preview:
                </Typography>
                <img
                  src={imagePreview}
                  alt="Banner Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Store Link */}
          <TextField
            label="Store Link"
            name="storeLink"
            variant="outlined"
            fullWidth
            required
            value={formData.storeLink}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          {/* Store Name */}
          <TextField
            label="Store Name"
            name="storeName"
            variant="outlined"
            fullWidth
            required
            value={formData.storeName}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              padding: '12px',
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Create Banner
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
