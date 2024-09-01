import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/Signup';
import HomePage from './components/Home/HomePage';
import RestaurantListing from './components/Home/RestaurantListing';
import MenuDisplay from './components/Home/MenuDisplay';
import OrderTracking from './components/Home/OrderTracking';
import UserProfile from './components/Profile/UserProfile';
import Cart from './components/Home/CartPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/restaurant-listing" element={<RestaurantListing />} />
        <Route path="/menu/:restaurantId" element={<MenuDisplay />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
