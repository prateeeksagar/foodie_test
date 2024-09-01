import React from 'react';
import { Container, TextField, Button, Typography, Box, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Header from '../Header/Header';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signup } from '../../api/auth';  // Import the signup function
import Cookies from 'js-cookie'; // Import js-cookie for cookie handling
import { toast, ToastContainer } from 'react-toastify'; // Import toast from react-toastify
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'customer',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log("here it is calling the function")
        values = {...values, role: "customer"}
        const response = await signup(values);
        console.log("this is main response", response)
        if(response.success) {
            if (response?.result?.token && response?.result?.userId) {
              // Save token and userId in cookies
              Cookies.set('token', response.result.token, { expires: 7 }); // expires in 7 days
              Cookies.set('userId', response.result.userId, { expires: 7 });
              Cookies.set('role', "customer", { expires: 7 });
    
              // Redirect to restaurant listing page
              navigate('/restaurant-listing');
            }

        } else {
            console.log("in the else")
            // toast.error(response.message || 'Signup failed. Please try again.');
            toast.error(response.message || "Signup failed. Please try again.", {
                position: "bottom-right"
              });
        }
      } catch (error) {
        console.error('Signup failed:', error);
        // Handle signup error (e.g., display error message)
      }
    },
  });

  return (
    <>
      <Header />
      <ToastContainer />
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
            Sign Up
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your name"
            />
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
              InputProps ={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Create a password"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ marginTop: 2, padding: 1 }}
              type="submit"
            >
              Sign Up
            </Button>
          </form>
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default SignupPage;
