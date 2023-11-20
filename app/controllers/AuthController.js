const Users = require("../models/Users")
const ErrorRes =  require('../utils/ErrorRes')
const bcrypt = require('bcryptjs')
const {generateToken, decodeToken} = require('../utils/TokenService')
const ApiRes = require("../utils/ApiRes")

//POST /auth/login
exports.login = async (req, res, next) => {
    const {phone, password} = req.body

    try{
        if (!phone) throw new ErrorRes('Please enter phone number', 400)
        if (!password) throw new ErrorRes('Please enter password', 400)

        const user = await Users.findOne({phone})
        if (!user) throw new ErrorRes('Phone is incorrect', 400)
        
        if (!bcrypt.compareSync(password, user.password)) throw new ErrorRes('Password is incorrect', 401)

        const code = generateToken({
            _id: user._id,
            isAdmin: user.isAdmin,
            isShipper: user.isShipper
        })

        const apiRes = new ApiRes()
            .setSuccess()
            .setData('code', code)
        res.json(apiRes)

    }catch(error){
        next(error)
    }
}

//POST register
exports.register = async (req, res, next) => {
    const {phone, password} = req.body
    try{
        if (!phone || !password) throw new ErrorRes('Please enter both phone number and password')
        const existUser = await Users.findOne({phone})
        if (existUser) throw new ErrorRes('Phone is already registered', 409)

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        req.body.password = hashPassword

        const user = new Users(req.body)
        await user.save()

        const code = generateToken({
            _id: user._id,
            isAdmin: user.isAdmin,
            isShipper: user.isShipper
        })

        const apiRes = new ApiRes().setSuccess('').setData('code', code)
        res.json(apiRes)
    }catch(error){
        next(error)
    }

}