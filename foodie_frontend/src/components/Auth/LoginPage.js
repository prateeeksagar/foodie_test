import React from 'react';
import { Container, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../api/auth'; // Import the login function
import { toast, ToastContainer } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import Cookies from 'js-cookie';

const LoginPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await login(values);
        console.log("response",response)
        if (response.success) {
          if (response.result.token && response.result.userId) {
            // Save token and userId in cookies
            Cookies.set('token', response.result.token, { expires: 7 });
            Cookies.set('userId', response.result.userId, { expires: 7 });

            // Redirect to restaurant listing page
            navigate('/restaurant-listing');
          }
        } else {
          toast.error(response.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    },
  });

  return (
    <>
      <Header />
      <ToastContainer/>
      <Container maxWidth="xs" sx={{ marginTop: 8 }}>
        <Box
          sx={{
            boxShadow: 3,
            padding: 4,
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your email"
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your password"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ marginTop: 2, padding: 1 }}
              type="submit"
            >
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
