const { response } = require('../utils/response');
const { runQuery } = require('../db_operations/sql_operations');
const orderService = require('../services/orderService');

const addOrderControl = async (req,res) => {
    const responseObject = {};
    const body = req.body;
    try {

        const userId = body.userId;
        const restaurantId = body.restaurantId;
        const orderItems = body.orderItems; // object of menuid and quantity

        const result = await orderService.addOrder({ userId, restaurantId, orderItems });
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

const getOrderHistory = async (req,res) => {
    const responseObject = {};
    const { orderId } = req.query;
    try {

        const result = await orderService.getOrderHistory({ orderId });
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}


const orderPayment = async (req,res) => {
    const responseObject = {};
    const { orderId } = req.query;
    try {

        const result = await orderService.orderPayment({ orderId });
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

module.exports = {
    addOrderControl,
    getOrderHistory,
    orderPayment
}