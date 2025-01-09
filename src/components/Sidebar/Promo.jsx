import React, { useState, useEffect } from "react";
import axios from "axios"; // If you want to use axios, you can install it
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CircularProgress,
} from "@mui/material";

const Promo = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    axios
      .get("http://api.xpediagames.com/api/blogs")
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={blog.banner}
                alt={blog.title}
              />
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {blog.short_desc}
                </Typography>
              </CardContent>
              <Button
                size="small"
                color="primary"
                href={blog.campaign_link}
                target="_blank"
              >
                Learn More
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Promo;
