const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { runQuery } = require('../db_operations/sql_operations');

// sign up service
const signup = async (email, password, username, role) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const isUserExist = await runQuery('select * from users where email = ?',[email]);
        console.log("result", isUserExist);
        if(isUserExist.value.length) {
           result.message = 'user already exist. Please login'
           result.statusCode = 200
           return result;
        }
        
        const insertIntoUsers = await runQuery('insert into users (name, email, password_hash, role, created_at) values (?,?,?,?, UNIX_TIMESTAMP(NOW()) )',[username, email, hashedPassword, role]);

        if(!insertIntoUsers.status) {
            result.message = 'something went wrong. please try again later.'
            result.statusCode = 500
            return result;
        }

        console.log(insertIntoUsers);

        const jwtSecret = 'prateek' 
        const jwtExpiresIn = 86400
        const token = jwt.sign(
            { userId: insertIntoUsers.value.insertId, role },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );

        result.message = 'Successfully created the user.'
        result.result.token = token;
        result.result.userId = insertIntoUsers.value.insertId
        result.status = true
        return result;
    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

// login service
const login = async (email, password) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};
    try {
        const isUserExist = await runQuery('select id,role,password_hash from users where email = ?', [email]);
        console.log(isUserExist);
        if(!isUserExist.status) {
            result.message = 'something went wrong. please try again later.'
            result.statusCode = 500
            return result;
        }

        const isMatch = await bcrypt.compare(password, isUserExist.value[0].password_hash);

        if(!isMatch) {
            result.message = 'Invalid User. Please enter valid password'
            result.statusCode = 401
            return result
        }

        const userId = isUserExist.value[0].id;
        const role = isUserExist.value[0].role;
        const jwtSecret = 'prateek' 
        const jwtExpiresIn = 86400
        const token = jwt.sign(
            { userId , role },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );

        result.status = true;
        result.message = 'successfully login.'
        result.result.token = token;
        result.result.userId = userId
        return result;
    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

const isRestaurantOwnerExist = async(userId) => {
    const isUserExist = await runQuery('select id from users where id = ? and role = ?', [userId, 'restaurant_owner']);
    console.log(isUserExist)
    if(isUserExist.status && isUserExist.value.length) return true;
    return false;
}

// get customer profile
const customerProfile = async ({userId}) => {
    const result = {};
    result.status = false;
    result.message = '';
    result.statusCode = 200;
    result.result = {};
    try {
        const userDetails = await runQuery('select name, email, mobile from users where id = ?', [userId]);
        console.log(userDetails);
        if(!userDetails.status || userDetails.value.length == 0) {
            result.message = 'something went wrong. please try again later.'
            result.statusCode = 500
            return result;
        }

        result.result = {
            userName : userDetails.value[0].name,
            email : userDetails.value[0].email,
            mobile : userDetails.value[0].mobile || "",
        }
        result.status = true;
        result.message = 'successfully fetched the user profile.'
        return result;
    } catch (error) {
        console.log(error);
        result.message = 'something went wrong. please try again later'
        return result;
    }
}

module.exports = {
    signup,
    login,
    isRestaurantOwnerExist,
    customerProfile
}

