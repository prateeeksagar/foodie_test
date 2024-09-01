const response = (req, res, status, message, result, statusCode) => {
    res.status(parseInt(statusCode ? statusCode : 200)).json({
        message: message,
        success: status,
        result: result ? result : null,
    });
}

module.exports = {
    response
}