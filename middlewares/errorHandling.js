const ApiRes = require('../app/utils/ApiRes')

const errorHandling = function(err, req, res, next){
    let status = err.statusCode || 500
    if (err.name == 'ValidationError') status = 400
    
    const apiRes = new ApiRes()
        .setFailure(err.message)
    console.error(err)
    res.status(status).json(apiRes)
}

module.exports = errorHandling