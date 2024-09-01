const express = require('express');
const menu = require('../controllers/menuController');
const { validateToken } = require('../middlewares');

const router = express.Router();

// To get all the menu list
router.get('/list',validateToken ,menu.getMenus);
// router.get('/', validateToken, restaurant.getRestaurantControl);
// router.get('/list', validateToken, restaurant.getRestaurantListControl)


// router.post('/signup',users.userSignUp)

module.exports = router;