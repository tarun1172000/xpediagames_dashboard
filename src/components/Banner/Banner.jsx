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
import * as XLSX from 'xlsx';

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

function Banner() {
  const [bannerData, setBannerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    store_name: '',
    store_link: '',
    banner_img: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [viewingBanner, setViewingBanner] = useState(null);
  const [viewingOpen, setViewingOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  // Fetch Banner data on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const response = await fetch('http://api.xpediagames.com/api/banners');
      const data = await response.json();
      setBannerData(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  // Open modal to edit a banner
  const handleOpenModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      store_name: banner.store_name,
      store_link: banner.store_link,
      banner_img: banner.banner_img,
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

  // Handle form submission (for PUT)
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
          prevBanners.map((banner) => (banner._id === updatedBanner._id ? updatedBanner : banner))
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

  // Handle deleting a banner
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
        setBannerData((prevBanners) => prevBanners.filter((banner) => banner._id !== id));
        showSnackbar('Banner deleted successfully', 'success');
      } else {
        showSnackbar('Error deleting the Banner', 'error');
      }
    } catch (error) {
      console.error('Error deleting Banner:', error);
      showSnackbar('Error deleting the Banner', 'error');
    }
  };

  // Handle viewing banner details
  const handleViewBanner = (id) => {
    const banner = bannerData.find((banner) => banner._id === id);
    setViewingBanner(banner);
    setViewingOpen(true);
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

  // Handle file change for Excel upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setExcelFile(file);
    } else {
      showSnackbar('Please upload a valid Excel file.', 'error');
    }
  };

  // Handle Excel upload
  const handleExcelUpload = async () => {
    if (!excelFile) {
      showSnackbar('Please select an Excel file first.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workBook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workBook.SheetNames[0];
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
          body: JSON.stringify({ banners: data }),
        });

        if (response.ok) {
          showSnackbar('Excel file uploaded successfully', 'success');
          setBannerData((prevData) => [...prevData, ...data]);
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
            Add New Banner
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '8px',
              marginRight: '12px',
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
              marginRight: '12px',
            }}
          >
            Submit Excel
          </Button>
        </Box>

        <Grid container spacing={4}>
          {bannerData.length === 0 ? (
            <Typography variant="h6" align="center" fullWidth>
              Loading...
            </Typography>
          ) : (
            bannerData.map((banner) => (
              <Grid item xs={12} sm={6} md={3} key={banner._id}>
                <Card sx={{ backgroundColor: 'background.paper', boxShadow: 3, position: 'relative' }}>
                  <CardMedia component="img" height="200" image={banner.banner_img} alt={banner.store_name} />
                  <CardContent>
                    <Typography variant="h6" noWrap color="text.primary">
                      {banner.store_name}
                    </Typography>
                  </CardContent>

                  <Box sx={{ position: 'absolute', top: '5px', right: '10px' }}>
                    <IconButton color="primary" onClick={() => handleViewBanner(banner._id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenModal(banner)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleDeleteBanner(banner._id)}>
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
            sx={{ width: '100%' }}
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
            height: '43vh',
            overflowY: 'scroll',
          }}>
            <Typography variant="h6" gutterBottom>{editingBanner ? 'Edit Banner' : 'Add Banner'}</Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Store Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="store_name"
                value={formData.store_name}
                onChange={handleInputChange}
              />
              <TextField
                label="Store Link"
                variant="outlined"
                fullWidth
                margin="normal"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
              />
              <TextField
                label="Banner Image URL"
                variant="outlined"
                fullWidth
                margin="normal"
                name="banner_img"
                value={formData.banner_img}
                onChange={handleInputChange}
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

export default Banner;
