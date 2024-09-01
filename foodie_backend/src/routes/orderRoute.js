const express = require('express');
const order = require('../controllers/orderController');
const { validateToken } = require('../middlewares');

const router = express.Router();

// To place an order
router.post('/add',validateToken ,order.addOrderControl);

// To get user order history
router.get('/history', validateToken, order.getOrderHistory)

router.post('/payment', validateToken, order.orderPayment)

module.exports = router;