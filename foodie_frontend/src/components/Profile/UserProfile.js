import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const UserProfile = () => {
  // Example user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    orders: [
      { id: 1, restaurant: 'Gourmet Pizza', date: '2024-08-28', total: '$25' },
      { id: 2, restaurant: 'Sushi Paradise', date: '2024-08-29', total: '$35' },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="h6">Name: {user.name}</Typography>
      <Typography variant="h6">Email: {user.email}</Typography>
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Order History
      </Typography>
      <List>
        {user.orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Order from ${order.restaurant}`}
              secondary={`Date: ${order.date} | Total: ${order.total}`}
            />
            <Button variant="contained" color="primary">
              View Details
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserProfile;
