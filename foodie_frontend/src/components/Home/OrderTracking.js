import React from 'react';
import { Container, Typography, LinearProgress } from '@mui/material';

const OrderTracking = () => {
  // Example order status
  const orderStatus = 50; // Percentage

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order Tracking
      </Typography>
      <Typography variant="body1">Your order is being prepared.</Typography>
      <LinearProgress variant="determinate" value={orderStatus} />
      <Typography variant="body2">{orderStatus}% Complete</Typography>
    </Container>
  );
};

export default OrderTracking;
