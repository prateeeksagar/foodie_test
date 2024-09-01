const jwt = require('jsonwebtoken');
const { response } = require('./utils/response');

const validateToken = async (req,res,next) => {
    const token = req.headers['token'];
    let userId;
    if(req.method == "GET") {
        userId = req.query.userId;
    } else {
        userId = req.body.userId;
    }
    console.log("userId---->",userId)
    try {
        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // Check if the userId in the token matches the provided userId
        if (decoded.userId === parseInt(userId)) {
            console.log("token Verified")
            next();
        } else {
            // If the token is valid and userId matches, return success
            response(req,res,false,"unauthorized user.", "" , 401)
        }

    } catch (error) {
        console.error('Token validation error:', error.message);
        return response(req,res,false,"unauthorizedc user.", "" , 401)
    }

}

module.exports = {
    validateToken
}