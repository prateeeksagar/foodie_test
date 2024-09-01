import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Typography, Container } from '@mui/material';

const Checkout = ({ totalPrice, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/order/payment', {
        amount: Math.round(totalPrice * 100), // Convert dollars to cents
      });

      const { clientSecret } = data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        setLoading(false);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        setLoading(false);
        onSuccess(); // Notify parent component of success
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h5">Complete Your Payment</Typography>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </form>
    </Container>
  );
};

export default Checkout;
