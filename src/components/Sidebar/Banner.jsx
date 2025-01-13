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
import * as XLSX from 'xlsx'; // For handling Excel files

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

function Banner() {
  const [BannerData, setBannerData] = useState([]);
  const [open, setOpen] = useState(false); // State to control Modal visibility
  const [editingBanner, setEditingBanner] = useState(null); // Banner being edited
  const [formData, setFormData] = useState({
    store_name: '',
    store_link : '',
    banner_img: '',
  });

  const [loading, setLoading] = useState(false); // Loading state for the PUT request
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error'

  const [viewingBanner, setViewingBanner] = useState(null);
  const [viewingOpen, setViewingOpen] = useState(false); // Modal visibility for viewing Banner

  const [excelFile, setExcelFile] = useState(null); // State to store selected file

  // Fetch Banner data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://api.xpediagames.com/api/banners');
        const data = await response.json();
        setBannerData(data);
      } catch (error) {
        console.error('Error fetching Banner data:', error);
      }
    };

    fetchData();
  }, []);

  // Open the modal to edit a Banner
  const handleOpenModal = (Banner) => {
    setEditingBanner(Banner);
    setFormData({
      store_name: Banner.store_name,
      store_link : Banner.store_link,
      banner_img: Banner.banner_img,
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://api.xpediagames.com/api/banner/${editingBanner._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedBanner = await response.json();
        setBannerData((prevBanners) =>
          prevBanners.map((Banner) => (Banner._id === updatedBanner._id ? updatedBanner : Banner))
        );
        showSnackbar('Banner updated successfully', 'success');
        handleCloseModal();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        showSnackbar('Error updating the Banner', 'error');
      }
    } catch (error) {
      console.error('Error updating Banner:', error);
      showSnackbar('Error updating the Banner', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://api.xpediagames.com/api/banner/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBannerData((prevBanners) => prevBanners.filter((Banner) => Banner._id !== id));
        showSnackbar('Banner deleted successfully', 'success');
      } else {
        showSnackbar('Error deleting the Banner', 'error');
      }
    } catch (error) {
      console.error('Error deleting Banner:', error);
      showSnackbar('Error deleting the Banner', 'error');
    }
  };

  const handleViewBanner = async (id) => {
    try {
      const response = await fetch(`http://api.xpediagames.com/api/Banner/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const Banner = await response.json();
        setViewingBanner(Banner);
        setViewingOpen(true);
      } else {
        showSnackbar('Error fetching the Banner details', 'error');
      }
    } catch (error) {
      console.error('Error fetching Banner:', error);
      showSnackbar('Error fetching the Banner details', 'error');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle the file change (for Excel upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setExcelFile(file);
    } else {
      showSnackbar('Please upload a valid Excel file.', 'error');
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      showSnackbar('Please select an Excel file first.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workBook = XLSX.read(binaryStr, { type: 'binary' });

      const sheetName = workBook.SheetNames[0]; // Assuming the first sheet is the one we want
      const sheet = workBook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://api.xpediagames.com/api/upload-banner-excel', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ banners: data }), // Assuming the API accepts the banner data as JSON
        });

        if (response.ok) {
          showSnackbar('Excel file uploaded successfully', 'success');
          setBannerData((prevData) => [...prevData, ...data]); // Optionally update the BannerData state
        } else {
          showSnackbar('Error uploading Excel file', 'error');
        }
      } catch (error) {
        console.error('Error uploading Excel file:', error);
        showSnackbar('Error uploading Excel file', 'error');
      }
    };
    reader.readAsBinaryString(excelFile);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ paddingRight: '10px', paddingLeft: '10px', maxWidth: '1200px', margin: '50px auto' }}>
        {/* Add New Banner Button */}
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
            Add New Banner
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
            onClick={() => document.getElementById('excel-file-input').click()}
          >
            Upload Excel
          </Button>

          <input
            type="file"
            id="excel-file-input"
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleExcelUpload}
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
            Submit Excel
          </Button>
        </Box>

        <Grid container spacing={4}>
          {BannerData.length === 0 ? (
            <Typography variant="h6" align="center" fullWidth>
              Loading...
            </Typography>
          ) : (
            BannerData.map((Banner) => (
              <Grid item xs={12} sm={6} md={3} key={Banner._id}>
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
                  <CardMedia component="img" height="200" image={Banner.banner_img} alt={Banner.store_name} />
                  <CardContent>
                    <Typography variant="h6" noWrap color="text.primary">
                      {Banner.store_name}
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
                      onClick={() => handleViewBanner(Banner._id)} // Open view modal
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      sx={{ marginRight: '5px' }}
                      onClick={() => handleOpenModal(Banner)} // Open edit modal
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteBanner(Banner._id)} // Delete Banner
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
              boxShadow: '0px 4px 10px rgba(242, 156, 30, 0.5)', // Set the text color to #f29c1e
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Modal for adding/editing Banner */}
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
            <Typography variant="h6" gutterBottom>{editingBanner ? 'Edit Banner' : 'Add Banner'}</Typography>

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
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleInputChange}
              />

              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{ marginTop: '15px' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Banner'}
              </Button>
            </form>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default Banner;

