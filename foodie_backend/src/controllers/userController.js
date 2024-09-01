

const { response } = require('../utils/response');
const { runQuery } = require('../db_operations/sql_operations');
const { signup, login, customerProfile } = require('../services/userService');

const userLogin = async (req,res) => {
    const responseObject = {};
    const body = req.body;
    try {
        const { email, password } = body;

        const result = await login(email, password);
        return response(req,res,true, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

const userSignUp = async (req,res) => {
    console.log("entering in the function")
    const responseObject = {};
    const body = req.body;
    try {
        const { email, password, username, role } = body;

        const result = await signup(email, password, username, role);
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}

const getProfile = async (req,res) => {
    console.log("entering in the function")
    const responseObject = {};
    const { userId } = req.query;
    try {

        const result = await customerProfile({userId});
        return response(req,res,result.status, result.message, result.result, result.statusCode);
        
    } catch (error) {
        console.log(error)
        return response(req,res,false,'something went wrong', responseObject, 500)
    }
}


module.exports = {
    userLogin,
    userSignUp,
    getProfile
}