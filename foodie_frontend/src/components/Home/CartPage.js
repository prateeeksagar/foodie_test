import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Divider, Button, IconButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { addOrder } from '../../api/order';
import Cookies from 'js-cookie';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Checkout from './Checkout';

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItemsWithDetails, restaurantId } = location.state;
  const userId = Cookies.get('userId');
  const [items, setItems] = useState(selectedItemsWithDetails);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Redirect if no items are left and the ui is responsive because of mui 
  useEffect(() => {
    if (items.length === 0 || totalPrice === 0) {
      toast.info("No items in the cart. Redirecting to the menu.");
      navigate(`/menu/${restaurantId}`);
    }
  }, [items, totalPrice, navigate, restaurantId]);

  const handleQuantityChange = (itemId, delta) => {
    const updatedItems = items
      .map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
      .filter(item => item.quantity > 0); // Remove items with zero quantity

    setItems(updatedItems);
  };

  const handleOrderSuccess = async () => {
    try {
      // Prepare the data for the API request
      const orderItems = items.map(item => ({
        itemId: item.id,
        quantity: item.quantity
      }));

      const requestBody = {
        userId,
        restaurantId,
        orderItems
      };

      // Send the POST request
      const response = await addOrder('api/order/add', requestBody);
      console.log(response);

      if (response.success) {
        const orderId = response.result.orderId;
        toast.success("Order placed successfully!");
        navigate(`/order-tracking/${orderId}/`, { state: { orderId } });
      } else {
        toast.error(response.message || "Failed to place the order.");
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("An error occurred while placing the order.");
    }
  };

  return (
    <>
      <ToastContainer />
      <Container>
        <Typography variant="h4" gutterBottom>
          Cart for Restaurant {restaurantId}
        </Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`Rs. ${item.name}`}
                secondary={`Rs ${item.price} each`}
              />
              <div>
                <IconButton 
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" display="inline">
                  {item.quantity}
                </Typography>
                <IconButton onClick={() => handleQuantityChange(item.id, 1)}>
                  <AddIcon />
                </IconButton>
              </div>
              <Typography variant="body2">
                ${item.price * item.quantity}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="h5" gutterBottom>
          Total: Rs. {totalPrice.toFixed(2)}
        </Typography>
        {showCheckout ? (
          <Checkout totalPrice={totalPrice} onSuccess={handleOrderSuccess} />
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowCheckout(true)} 
            sx={{ marginTop: 2 }}
          >
            Proceed to Payment
          </Button>
        )}
      </Container>
    </>
  );
};

export default Cart;
