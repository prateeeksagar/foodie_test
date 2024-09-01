const { runQuery } = require('../db_operations/sql_operations');
const { isRestaurantOwnerExist } = require('./userService');


// this service is used to add the order placed
const addOrder = async ({ userId, restaurantId, orderItems }) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};
    try {

        let totalAmount = 0, orderId;

        for(let item of orderItems) {
            let itemPrice = 0;
            let menu = await runQuery(`select price from menus where id = ? and restaurant_id = ? and is_deleted = 'N'`,[item.itemId, restaurantId])
            if(menu.status && menu.value.length) {
                itemPrice = menu.value[0].price;
            }
            totalAmount += item.quantity * itemPrice
        }

        const insertOrder = await runQuery('insert into orders (user_id, restaurant_id, total_price, created_at) values (?,?,?, UNIX_TIMESTAMP(NOW()) )',[userId, restaurantId, totalAmount]);
        if(insertOrder.status) {
            orderId = insertOrder.value.insertId;
        } else {
            result.message = 'something went wrong. please try again later'   
            return result;
        }

        for(let item of orderItems) {
            let itemPrice = 0;
            let menu = await runQuery(`select price from menus where id = ? and restaurant_id = ? and is_deleted = 'N'`,[item.itemId, restaurantId])
            if(menu.status && menu.value.length) {
                itemPrice = menu.value[0].price;
            }
            let insertOrderItem = await runQuery('insert into order_items (order_id, menu_id, quantity, order_time_price, created_at) values (?,?,?,?,UNIX_TIMESTAMP(NOW()))', [orderId,parseInt(item.itemId),parseInt(item.quantity), itemPrice])
        }

        result.result = { orderId }
        result.status = true;
        result.message = 'successfully placed the order'
        return result;

    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

// this service is used to get the order history
const getOrderHistory = async ({ orderId }) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};
    try {
        let dataObj = {};
        const orderDetails = await runQuery("select o.total_price ,o.order_status, r.name, r.location, r.rating  from orders o inner join restaurants r  on o.restaurant_id = r.id where o.id = ? and o.is_deleted = 'N'", [orderId]);
        console.log(orderDetails);
        if(orderDetails.status && orderDetails.value.length) {
            dataObj.totalPrice = orderDetails.value[0].total_price;
            dataObj.orderStatus = orderDetails.value[0].order_status;
            dataObj.restaurantName = orderDetails.value[0].name;
            dataObj.restaurantLocation = orderDetails.value[0].location;
            dataObj.restaurantRating = orderDetails.value[0].rating  // it return the ratin of the restaurant
        }

        const orderItems = await runQuery("select id,quantity,order_time_price as orderPrice from order_items where order_id = ?", [orderId]);
        console.log(orderItems)
        if(orderItems.status && orderItems.value.length) {
            dataObj.orderItems = orderItems.value;
        }
        result.result = dataObj
        result.status = true;
        result.message = 'successfully fetched the data'
        return result;

    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

const orderPayment = async (amount) => {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // or another currency as needed
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
    addOrder,
    getOrderHistory,
    orderPayment
}