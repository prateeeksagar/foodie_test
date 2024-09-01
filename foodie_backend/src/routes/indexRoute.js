const express = require('express')
const router = express.Router();

const users = require('./users');
const restaurants = require('./restaurantRoute')
const menus = require('./menuRoute')
const orders = require('./orderRoute')

// To handle all the user routes
router.use('/api/user',users);

// To handle all the restaurants
router.use('/api/restaurant',restaurants);

// To handle all the menus 
router.use('/api/menu',menus);

// To handle all the orders
router.use('/api/order',orders)

module.exports = router;