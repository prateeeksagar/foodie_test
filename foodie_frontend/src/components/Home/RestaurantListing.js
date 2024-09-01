import React, { useEffect, useState } from 'react';
import { Container, Grid,Grid2 ,Card, CardContent, CardMedia, Typography, Button, Box, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getRestaurantList } from '../../api/restaurant';

const RestaurantListing = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit] = useState(10); // Set the default limit
  const [total, setTotal] = useState(0); // To store total count of restaurants
    const userId = Cookies.get('userId');
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurantList(`api/restaurant/list/?userId=${userId}&page=${page}&limit=${limit}`);
        console.log(response);
        if (response.success) {
          setRestaurants(response.result); // Adjust according to your API response structure
          setTotal(limit); // Assuming API provides total count
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, limit]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Restaurants
      </Typography>
      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={restaurant.image || 'placeholder.jpg'}
                alt={restaurant.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {restaurant.name}
                </Typography>
                <Button component={Link} to={`/menu/${restaurant.id}`} variant="contained" color="primary">
                  View Menu
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Pagination
          count={Math.ceil(total / limit)} // Total pages based on limit
          page={page + 1} // MUI Pagination is 1-based
          onChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default RestaurantListing;
