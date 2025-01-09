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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

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

function Store() {
  const [StoreData, setStoreData] = useState([]);
  const [open, setOpen] = useState(false); // State to control Modal visibility
  const [editingStore, setEditingStore] = useState(null); // Store being edited
  const [formData, setFormData] = useState({
    title: '',
    store_name: '',
    short_desc: '',
    category: '',
    author: '',
    all_data: '',
    banner: '',
    campaign_link: '',
    meta_keyword: '',
    post_data: false,
    trending: false,
    store_img : '',
    about_store : ""
  });

  const [loading, setLoading] = useState(false); // Loading state for the PUT request
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error'

  // State to store the Store details for viewing
  const [viewingStore, setViewingStore] = useState(null);
  const [viewingOpen, setViewingOpen] = useState(false); // Modal visibility for viewing Store

  // Fetch Store data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://api.xpediagames.com/api/stores');
        const data = await response.json();
        console.log("Store ", data)

        setStoreData(data);
      } catch (error) {
        console.error('Error fetching Store data:', error);
      }
    };

    fetchData();
  }, []);

  // Open the modal to edit a Store
  const handleOpenModal = (Store) => {
    setEditingStore(Store);
    setFormData({
      client_name: Store.client_name,
      trending: Store.trending,
      short_desc: Store.short_desc,
      category: Store.category,
      author: Store.author,
      all_data: Store.all_data,
      banner: Store.banner,
      campaign_link: Store.campaign_link,
      meta_keyword: Store.meta_keyword.join(', '),
      post_data: Store.post_data,
      trending: Store.trending,
      store_img:Store.store_img,
      store_name : Store.store_name,
      about_store : Store.about_store
    });
    setOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setEditingStore(null);
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

      const response = await fetch(`http://api.xpediagames.com/api/store/${editingStore._id}`, {
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
        const updatedStore = await response.json();
        // Update the state to reflect the changes
        setStoreData((prevStores) =>
          prevStores.map((Store) => (Store._id === updatedStore._id ? updatedStore : Store))
        );
        showSnackbar('Store updated successfully', 'success');
        handleCloseModal();

        setTimeout(() => {
          window.location.reload(); // Reload the entire page
        }, 500);
      } else {
        showSnackbar('Error updating the Store', 'error');
      }
    } catch (error) {
      console.error('Error updating Store:', error);
      showSnackbar('Error updating the Store', 'error');
    } finally {
      setLoading(false);
    }
  };


  // Handle deleting a Store
  const handleDeleteStore = async (id) => {
    try {

      const token = localStorage.getItem('access_token');

      const response = await fetch(`http://api.xpediagames.com/api/store/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStoreData((prevStores) => prevStores.filter((Store) => Store._id !== id));
        showSnackbar('Store deleted successfully', 'success');
      } else {
        showSnackbar('Error deleting the Store', 'error');
      }
    } catch (error) {
      console.error('Error deleting Store:', error);
      showSnackbar('Error deleting the Store', 'error');
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

  // Handle the 'View Store' action
  const handleViewStore = async (id) => {
    try {

      const response = await fetch(`http://api.xpediagames.com/api/store/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const Store = await response.json();
        setViewingStore(Store); // Set the Store data for viewing
        setViewingOpen(true); // Open the modal to show the Store details
      } else {
        showSnackbar('Error fetching the Store details', 'error');
      }
    } catch (error) {
      console.error('Error fetching Store:', error);
      showSnackbar('Error fetching the Store details', 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ paddingRight: '10px', paddingLeft: '10px', maxWidth: '1200px', margin: '50px auto' }}>
        {/* Add New Store Button */}
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
            Add New Store
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
          {StoreData.length === 0 ? (
            <Typography variant="h6" align="center" fullWidth>
              Loading...
            </Typography>
          ) : (
            StoreData.map((Store) => (
              <Grid item xs={12} sm={6} md={3} key={Store._id}>
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
                  <CardMedia component="img" height="200" padding = "10" image={Store.store_img} alt={Store.title} />
                  <CardContent>
                    <Typography variant="h6" noWrap color="text.primary">
                      {Store.store_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {Store.about_store}
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
                      onClick={() => handleViewStore(Store._id)} // Open view modal
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      sx={{ marginRight: '5px' }}
                      onClick={() => handleOpenModal(Store)} // Open edit modal
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteStore(Store._id)} // Delete Store
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


        {/* Modal for adding/editing Store */}
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
            <Typography variant="h6" gutterBottom>{editingStore ? 'Edit Store' : 'Add Store'}</Typography>

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
                label="All Data"
                variant="outlined"
                fullWidth
                margin="normal"
                name="all_data"
                value={formData.all_data}
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

        {/* Modal for Viewing Store Details */}
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
            {viewingStore ? (
              <>
                {/* Title */}
                <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {viewingStore.title}
                </Typography>

                {/* Client Name */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Client Name:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.client_name}</span>
                </Typography>

                {/* Trending */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Trending:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.trending ? 'Yes' : 'No'}</span>
                </Typography>

                {/* Category */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Category:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.category}</span>
                </Typography>

                {/* Store Type */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Store Type:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.Store_type}</span>
                </Typography>

                {/* Short Description */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Short Description:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.short_desc}</span>
                </Typography>

                {/* Description */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Description:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.description}</span>
                </Typography>

                {/* Meta Keywords */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Meta Keywords:</strong> <span style={{ color: '#f29c1e' }}>{viewingStore.meta_keyword.join(', ')}</span>
                </Typography>

                {/* Campaign Link */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Campaign Link:</strong>{' '}
                  <a href={viewingStore.campaign_link} target="_blank" rel="noopener noreferrer" style={{ color: '#f29c1e' }}>
                    {viewingStore.campaign_link}
                  </a>
                </Typography>

                {/* Banner */}
                <Box sx={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src={viewingStore.banner}
                    alt={viewingStore.title}
                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                  />
                </Box>

                {/* Conditions */}
                <Typography variant="body1" color="text.primary" gutterBottom>
                  <strong>Conditions:</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {viewingStore.conditions.map((condition, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        <Typography variant="body2" color="text.secondary">
                          {condition}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Typography>

                {/* Features */}
                <Typography variant="body1" color="text.primary" gutterBottom>
                  <strong>Features:</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {viewingStore.feature.map((feature, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Typography>

                {/* FAQs */}
                <Typography variant="body1" color="text.primary" gutterBottom>
                  <strong>FAQs:</strong>
                  {viewingStore.faq.map((faq) => (
                    <Box key={faq.id} sx={{ marginBottom: '12px' }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        Q: {faq.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        A: {faq.answer}
                      </Typography>
                    </Box>
                  ))}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Loading Store details...
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

export default Store;
