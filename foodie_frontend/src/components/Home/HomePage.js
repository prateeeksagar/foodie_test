import React from 'react';
import { Container, Typography, Button, Box, Grid, Grid2 } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';

const HomePage = () => {
  return (
    <>
    <Header />
    <Container maxWidth="lg">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Foodies' Fiesta!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Savor the best dishes from top restaurants, delivered to your doorstep.
        </Typography>
        <Grid2 container spacing={2} justifyContent="center" sx={{ marginTop: 4 }}>
          <Grid2 item>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              size="large"
            >
              Login
            </Button>
          </Grid2>
          <Grid2 item>
            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              color="secondary"
              size="large"
            >
              Sign Up
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
    </>
  );
};

export default HomePage;
