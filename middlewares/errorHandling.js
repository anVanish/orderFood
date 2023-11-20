const ApiRes = require('../app/utils/ApiRes')

const errorHandling = function(err, req, res, next){
    let status = 500
    if (err.name == 'ValidationError') status = 400
    
    const apiRes = new ApiRes()
        .setFailure(err.message)
    console.error(err)
    res.json(apiRes)
}

module.exports = errorHandling