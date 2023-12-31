const ErrorRes = require('../app/utils/ErrorRes')
const {decodeToken} = require('../app/utils/TokenService')

exports.authToken = (req, res, next) =>{
    const token = req.headers.authorization
    if (!token) {
        return next(new ErrorRes('Missing token', 401))
    }
    const decodedToken = decodeToken(token.split(' ')[1])

    if (!decodedToken) {
        return next(new ErrorRes('Token not valid', 401))
    }
    req.user = decodedToken.data
    next()
}

exports.authUser = (req, res, next) =>{
    console.log(req.user)
    if (!req.user || !req.user._id) return next(new ErrorRes('Required login', 401))
    next()
}

exports.authAdmin = (req, res, next) =>{
    if (!req.user || !req.user.isAdmin) return next(new ErrorRes('Required login', 401))
    next()
}