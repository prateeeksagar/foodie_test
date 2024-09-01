const { runQuery } = require('../db_operations/sql_operations');
const { isRestaurantOwnerExist } = require('./userService');

const addResturant = async ({name, cuisine, location, owner_id}) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};
    try {
        
        isOwnerExist = await isRestaurantOwnerExist(owner_id);
        console.log("This is ownder exist",isOwnerExist);
        if(!isOwnerExist) {
            result.message = 'unauthorized access to add restaturant'
            result.statusCode = 401
            return result
        }

        const isRestaurantNameExist = await runQuery('select id from restaurants where name = ? and location = ? and owner_id = ? and is_deleted = ?', [name, location, owner_id, "N"]);
        console.log(isRestaurantNameExist)
        if(isRestaurantNameExist.status && isRestaurantNameExist.value.length) {
            result.message = 'Restaurant already exist. Please choose different name.'
            result.statusCode = 400
            return result
        }

        const insertRestaurant = await runQuery('insert into restaurants (name, cuisine, location, owner_id, created_at) values (?,?,?,?, UNIX_TIMESTAMP(NOW()) )', [name, cuisine, location, owner_id]);

        if(!insertRestaurant.status) {
            result.message = 'something went wrong. please try again later.'
            result.statusCode = 500
            return result;
        }

        result.status = true;
        result.message = 'successfully added the restaurant'
        return result;

    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }

}

const getRestaurantById = async ({restaurantId}) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};

    try {
        const restaurant = await restaurantDataById(restaurantId);
        if(!restaurant?.status) {
            result.statusCode = 500;
            result.message = 'something went wrong. please try again later'
            return result;
        }

        result.status = true;
        result.message = 'successfully fetched the data'
        result.result = restaurant.value
        return result;
    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

const restaurantDataById  = async (restaurantId) => {
    try {
        const restaurantData = await runQuery('select * from restaurants where id = ? and is_deleted = ?', [restaurantId,"N"]);
        return restaurantData;
    } catch (error) {
        return {status: false};
    }
}

const getRestaurantList = async ({page, limit}) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};

    try {
        const restaurantList = await runQuery('select * from restaurants where is_deleted = ? limit ? offset ?', ["N",parseInt(limit), parseInt(page)]);
        if(restaurantList.status) {
            result.message = 'successfullly fetched the data'
            result.result = restaurantList.value
            result.status = true;
            return result;
        }

        result.message = 'Something went wrong. Please try again later'
        result.statusCode = 500;
        return result;
    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

module.exports = {
    addResturant,
    getRestaurantById,
    getRestaurantList
}