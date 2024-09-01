const express = require('express');
const restaurant = require('../controllers/restaurantController');
const { validateToken } = require('../middlewares');

const router = express.Router();

// To add restaurant by restaurant owner
router.post('/add',validateToken ,restaurant.addRestaurantControl);

// To get all the restaurant details
router.get('/', validateToken, restaurant.getRestaurantControl);

// To get all the restaurants
router.get('/list', validateToken, restaurant.getRestaurantListControl)


// router.post('/signup',users.userSignUp)

module.exports = router;