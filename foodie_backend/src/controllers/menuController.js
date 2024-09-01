const { response } = require('../utils/response');
const { runQuery } = require('../db_operations/sql_operations');
const menuService = require('../services/menuService');

const addRestaurantControl = async (req,res) => {
    const responseObject = {};
    const body = req.body;
    try {
        
        const {userId, name, cuisine, location} = body;

        const result = await restaurantService.addResturant({name, cuisine, location, owner_id: userId });
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

const getRestaurantControl = async (req,res) => {
    const responseObject = {};
    try {
        const {restaurantId, userId} = req.query;
        const result = await restaurantService.getRestaurantById({ restaurantId, ownerId: userId });
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

const getMenus = async (req,res) => {
    const responseObject = {};
    try {
        const {restaurantId} = req.query
        const result = await menuService.getMenuList({ restaurantId });
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

module.exports = {
    getMenus
}