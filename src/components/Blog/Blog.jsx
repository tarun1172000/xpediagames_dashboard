import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
  Modal,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
// Define the dark theme
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

function Blog() {
  const [blogData, setBlogData] = useState([]);
  const [open, setOpen] = useState(false); // State to control Modal visibility
  const [editingBlog, setEditingBlog] = useState(null); // Blog being edited
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

  const [loading, setLoading] = useState(false); // Loading state for the PUT request
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error'

  // State to store the blog details for viewing
  const [viewingBlog, setViewingBlog] = useState(null);
  const [viewingOpen, setViewingOpen] = useState(false); // Modal visibility for viewing blog

  // Fetch blog data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.xpediagames.com/api/blogs');
        const data = await response.json();
        console.log("Blog ", data)

        setBlogData(data);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchData();
  }, []);

  // Open the modal to edit a blog
  const handleOpenModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      client_name: blog.client_name,
      short_desc: blog.short_desc,
      category: blog.category,
      author: blog.author,
      all_data: blog.all_data,
      banner: blog.banner,
      campaign_link: blog.campaign_link,
      meta_keyword: blog.meta_keyword.join(', '),
      post_data: blog.post_data,
      trending: blog.trending,
    });
    setOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setEditingBlog(null);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle checkbox change for boolean values (post_data, trending)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Submit the form (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      console.log("PUT ", token)

      const response = await fetch(`https://api.xpediagames.com/api/blog/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          meta_keyword: formData.meta_keyword.split(',').map((keyword) => keyword.trim()), // Ensure keywords are trimmed
        }),

      });

      if (response.ok) {
        const updatedBlog = await response.json();
        // Update the state to reflect the changes
        setBlogData((prevBlogs) =>
          prevBlogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
        );
        showSnackbar('Blog updated successfully', 'success');
        handleCloseModal();

        setTimeout(() => {
          window.location.reload(); // Reload the entire page
        }, 500);
      } else {
        showSnackbar('Error updating the blog', 'error');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      showSnackbar('Error updating the blog', 'error');
    } finally {
      setLoading(false);
    }
  };


  // Handle deleting a blog
  const handleDeleteBlog = async (id) => {
    try {

      const token = localStorage.getItem('access_token');

      const response = await fetch(`https://api.xpediagames.com/api/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBlogData((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        showSnackbar('Blog deleted successfully', 'success');
      } else {
        showSnackbar('Error deleting the blog', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      showSnackbar('Error deleting the blog', 'error');
    }
  };

  // Show Snackbar with message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Close Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Handle the 'View Blog' action
  const handleViewBlog = async (id) => {
    try {
      // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNjMyMjg1MCwianRpIjoiZjlhZTQ0YTEtZmFjNS00MzY5LWI0NGQtOGU4ZWUyMGM5MDIxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InByaXR1bEBmbHloZWFkbWVkaWEuY29tIiwibmJmIjoxNzM2MzIyODUwLCJjc3JmIjoiNDI2YzEwOGYtMzEwOC00YzA3LWI5MzgtZjdkNTNjZTQwODQ5IiwiZXhwIjoxNzM2MzIzNzUwfQ.Z0A-l2Ky5IdAkBiHdEvWxthquwJ_cCooV9UgzmzJEMk";

      const response = await fetch(`https://api.xpediagames.com/api/blog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const blog = await response.json();
        setViewingBlog(blog); // Set the blog data for viewing
        setViewingOpen(true); // Open the modal to show the blog details
      } else {
        showSnackbar('Error fetching the blog details', 'error');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      showSnackbar('Error fetching the blog details', 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ paddingRight: '10px', paddingLeft: '10px', maxWidth: '1200px', margin: '50px auto' }}>
        {/* Add New Blog Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
          <Button
            variant="contained"
            color="primary"

            sx={{
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '8px',
              marginRight: "12px",
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#f2a800',
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <Link to="/addBlog" style={{ color: 'black', textDecoration: 'none' }}>
              Add New Blog
            </Link>
          </Button>
          <Button
            variant="contained"
            color="primary"

            sx={{
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '8px',
              marginRight: "12px",
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#f2a800',
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            Upload Excel
          </Button>
        </Box>

        <Grid container spacing={4}>
          {blogData.length === 0 ? (
            <Typography variant="h6" align="center" fullWidth>
              Loading...
            </Typography>
          ) : (
            blogData.map((blog) => (
              <Grid item xs={12} sm={6} md={3} key={blog._id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 20px rgba(242, 156, 30, 0.5)' },
                    backgroundColor: 'background.paper',
                    boxShadow: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover .icon-container': {
                      opacity: 1,
                    },
                  }}
                >
                  <CardMedia component="img" height="200" image={blog.banner} alt={blog.title} />
                  <CardContent>
                    <Typography variant="h6" noWrap color="text.primary">
                      {blog.client_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {blog.short_desc}
                    </Typography>
                  </CardContent>

                  <Box
                    className="icon-container"
                    sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '10px',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <IconButton
                      color="primary"
                      sx={{ marginRight: '5px' }}
                      onClick={() => handleViewBlog(blog._id)} // Open view modal
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      sx={{ marginRight: '5px' }}
                      onClick={() => handleOpenModal(blog)} // Open edit modal
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteBlog(blog._id)} // Delete blog
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

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
              backgroundColor: "black",
              border: "1px solid #f29c1e ",
              boxShadow: '0px 4px 10px rgba(242, 156, 30, 0.5)',// Set the text color to #f29c1e
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>


        {/* Modal for adding/editing blog */}
        <Modal open={open} onClose={handleCloseModal} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{
            padding: '20px',
            backgroundColor: 'background.default',
            borderRadius: '8px',
            maxWidth: '600px',
            border: "1px solid #f29c1e",
            height: '80vh',
            overflowY: 'scroll',
          }}>
            <Typography variant="h6" gutterBottom>{editingBlog ? 'Edit Blog' : 'Add Blog'}</Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <TextField
                label="Client Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
              />
              <TextField
                label="Short Description"
                variant="outlined"
                fullWidth
                margin="normal"
                name="short_desc"
                value={formData.short_desc}
                onChange={handleInputChange}
              />
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                margin="normal"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
              <TextField
                label="Author"
                variant="outlined"
                fullWidth
                margin="normal"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
            

              <TextField
                label="Banner URL"
                variant="outlined"
                fullWidth
                margin="normal"
                name="banner"
                value={formData.banner}
                onChange={handleInputChange}
              />
              <TextField
                label="Campaign Link"
                variant="outlined"
                fullWidth
                margin="normal"
                name="campaign_link"
                value={formData.campaign_link}
                onChange={handleInputChange}
              />
              <TextField
                label="Meta Keywords"
                variant="outlined"
                fullWidth
                margin="normal"
                name="meta_keyword"
                value={formData.meta_keyword}
                onChange={handleInputChange}
              />
                <ReactQuill
                value={formData.all_data}
                onChange={(value) => setFormData({ ...formData, all_data: value })}
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
                  height: "500px", // Adjust the height as needed
                  color: 'black',
                  borderRadius: '8px',
                  padding: '10px',
                  paddingBottom:"40px"
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={formData.post_data} onChange={handleCheckboxChange} name="post_data" />}
                label="Post Data"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.trending} onChange={handleCheckboxChange} name="trending" />}
                label="Trending"
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading} // Disable the button when loading
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
                <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
              </Box>
            </form>
          </Box>
        </Modal>

        {/* Modal for Viewing Blog Details */}
        <Modal
          open={viewingOpen}
          onClose={() => setViewingOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            sx={{
              padding: '30px',
              backgroundColor: 'background.paper',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              border: '1px solid #f29c1e',
              height: '80vh',
              overflowY: 'auto',
              boxShadow: 24,
            }}
          >
            {viewingBlog ? (
              <>
                {/* Title */}
                <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {viewingBlog.title}
                </Typography>

                {/* Client Name */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Client Name:</strong> <span style={{ color: '#f29c1e' }}>{viewingBlog.client_name}</span>
                </Typography>

                {/* Category */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Category:</strong> <span style={{ fontWeight: 'bold' }}>{viewingBlog.category}</span>
                </Typography>

                {/* Author */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Author:</strong> <span style={{ color: '#f29c1e' }}>{viewingBlog.author}</span>
                </Typography>

                {/* Short Description */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Short Description:</strong><span style={{ color: '#f29c1e' }}> {viewingBlog.short_desc} </span>
                </Typography>

                {/* All Data */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>All Data:</strong> <span style={{ color: '#f29c1e' }}>  {viewingBlog.all_data}</span>
                </Typography>

                {/* Meta Keywords */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Meta Keywords:</strong>  <span style={{ color: '#f29c1e' }}>  {viewingBlog.meta_keyword.join(', ')}</span>
                </Typography>

                {/* Campaign Link */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Campaign Link:</strong>{' '}
                  <a href={viewingBlog.campaign_link} target="_blank" rel="noopener noreferrer" style={{ color: '#f29c1e' }}>
                    {viewingBlog.campaign_link}
                  </a>
                </Typography>

                {/* Banner Image */}
                <Box sx={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src={viewingBlog.banner}
                    alt={viewingBlog.title}
                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Loading blog details...
              </Typography>
            )}

            {/* Close Button */}
            <Button
              onClick={() => setViewingOpen(false)}
              color="primary"
              variant="contained"
              sx={{
                marginTop: '20px',
                width: '100%',
                padding: '10px 0',
                borderRadius: '8px',
                backgroundColor: '#f29c1e',
                '&:hover': {
                  backgroundColor: '#d17a1e',
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>

      </Box>
    </ThemeProvider>
  );
}

export default Blog;
