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
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Define the dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f29c1e',
    },
    background: {
      default: 'black',
      paper: '#1c0c02',
    },
    text: {
      primary: '#f48d4c',
      secondary: '#bbbbbb',
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
  const [storeData, setStoreData] = useState([]);
  const [open, setOpen] = useState(false); // State for the Edit Modal
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    store_name: '',
    store_link: '',
    store_img: '',
    about_store: '',
    term_conditions: '',
    store_live: true,
    meta_keyword: '',
    meta_disc: '',
    meta_title: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [viewingStore, setViewingStore] = useState(null);
  const [viewingOpen, setViewingOpen] = useState(false); // State for Viewing Modal

  // Fetch Store data on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Fetch all stores
  const fetchStores = async () => {
    try {
      const response = await fetch('https://api.xpediagames.com/api/stores');
      const data = await response.json();
      setStoreData(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  // Open modal to edit a store
  const handleOpenModal = (store) => {
    setEditingStore(store);
    setFormData({
      store_name: store.store_name,
      store_link: store.store_link,
      store_img: store.store_img,
      about_store: store.about_store,
      term_conditions: store.term_conditions,
      store_live: store.store_live,
      meta_keyword: store.meta_keyword,
      meta_disc: store.meta_disc,
      meta_title: store.meta_title,
    });
    setOpen(true); // Open the Edit Modal
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingStore(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (for PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://api.xpediagames.com/api/store/${editingStore._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedStore = await response.json();
        setStoreData((prevStores) =>
          prevStores.map((store) => (store._id === updatedStore._id ? updatedStore : store))
        );
        showSnackbar('Store updated successfully', 'success');
        handleCloseModal();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        showSnackbar('Error updating the store', 'error');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      showSnackbar('Error updating the store', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a store
  const handleDeleteStore = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://api.xpediagames.com/api/store/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStoreData((prevStores) => prevStores.filter((store) => store._id !== id));
        showSnackbar('Store deleted successfully', 'success');
      } else {
        showSnackbar('Error deleting the store', 'error');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      showSnackbar('Error deleting the store', 'error');
    }
  };

  // Handle viewing store details
  const handleViewStore = async (id) => {
    try {
      // Fetch specific store data by ID
      const response = await fetch(`https://api.xpediagames.com/api/store/${id}`);
      if (response.ok) {
        const store = await response.json();
        setViewingStore(store);  // Set the fetched store data to viewingStore state
        setViewingOpen(true);     // Open the modal to show the store details
      } else {
        showSnackbar('Error fetching store details', 'error');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      showSnackbar('Error fetching store details', 'error');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ paddingRight: '10px', paddingLeft: '10px', maxWidth: '1200px', margin: '50px auto' }}>
        {/* Add New Store Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '25px' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <Link to="/addStore" style={{ color: 'black', textDecoration: 'none' }}>
              Add New Store
            </Link>
          </Button>
        </Box>

        <Grid container spacing={4}>
          {storeData.length === 0 ? (
            <Typography variant="h6" align="center" fullWidth>
              Loading...
            </Typography>
          ) : (
            storeData.map((store) => (
              <Grid item xs={12} sm={6} md={3} key={store._id}>
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
                  <CardMedia component="img" height="200" objectFit="contain" image={store.store_img} alt={store.store_name} />
                  <CardContent>
                    <Typography variant="h6" noWrap color="text.primary">
                      {store.store_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {store.about_store}
                    </Typography>
                  </CardContent>

                  <Box sx={{ position: 'absolute', top: '5px', right: '10px' }}>
                    <IconButton color="primary" onClick={() => handleViewStore(store._id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenModal(store)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleDeleteStore(store._id)}>
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
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Modal for viewing store details */}
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
              height: '50vh',
              overflowY: 'auto',
              boxShadow: 24,
            }}
          >
            {viewingStore ? (
              <>
                <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {viewingStore.store_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>About Store:</strong> {viewingStore.about_store}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Store Link:</strong>{' '}
                  <a href={viewingStore.store_link} target="_blank" rel="noopener noreferrer" style={{ color: '#f29c1e' }}>
                    {viewingStore.store_link}
                  </a>
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Terms and Conditions:</strong> {viewingStore.term_conditions}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Meta Keywords:</strong> {viewingStore.meta_keyword}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Meta Description:</strong> {viewingStore.meta_disc}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Meta Title:</strong> {viewingStore.meta_title}
                </Typography>
                <Box sx={{ marginBottom: '20px',height :"60vh", width :"auto", borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src={viewingStore.store_img}
                    alt={viewingStore.store_name

                    }
                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">Loading store details...</Typography>
            )}
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

        {/* Modal for editing store */}
        <Modal
          open={open}
          onClose={handleCloseModal}
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
              overflowY: 'auto',
              boxShadow: 24,
            }}
          >
            <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
              Edit Store
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Store Name"
                name="store_name"
                value={formData.store_name}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Store Link"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Store Image"
                name="store_img"
                value={formData.store_img}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="About Store"
                name="about_store"
                value={formData.about_store}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Terms and Conditions"
                name="term_conditions"
                value={formData.term_conditions}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Meta Keywords"
                name="meta_keyword"
                value={formData.meta_keyword}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Meta Description"
                name="meta_disc"
                value={formData.meta_disc}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                fullWidth
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
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
      </Box>
    </ThemeProvider>
  );
}

export default Store;
