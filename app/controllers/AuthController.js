const Users = require("../models/Users")
const ErrorRes =  require('../utils/ErrorRes')
const bcrypt = require('bcryptjs')
const {generateToken, decodeToken} = require('../utils/TokenService')
const ApiRes = require("../utils/ApiRes")
const {sendMail} = require('../utils/sendMail')
const {genOtp} = require('../utils/generateOtp')
const { verify } = require("jsonwebtoken")

//POST /auth/login
exports.login = async (req, res, next) => {
    const {email, password} = req.body

    try{
        if (!email) throw new ErrorRes('Please enter email', 400)
        if (!password) throw new ErrorRes('Please enter password', 400)

        const user = await Users.findOne({email})
        if (!user) throw new ErrorRes('Email is incorrect', 400)
        
        if (!user.isVerified) throw new ErrorRes('Email not verified', 403)

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

//POST /auth/register
exports.register = async (req, res, next) => {
    const {email, password} = req.body
    try{
        if (!email || !password) throw new ErrorRes('Please enter both email number and password')
        const existUser = await Users.findOne({email})
        if (existUser) throw new ErrorRes('Email is already registered', 409)

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        req.body.password = hashPassword

        const user = new Users(req.body)
        user.otpCode = genOtp()
        await user.save()

        await sendMail(user.email, 'Welcome to Our restaurant', `Your varification OTP is ${user.otpCode}, don't share this to other people.`)
 
        const apiRes = new ApiRes().setSuccess('Mail sent, please verify email')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /auth/verify
exports.verify = async (req, res, next) => {
    const {email, otp} = req.body
    try{
        const user = await Users.findOne({email})
        if (!user) throw new ErrorRes('User not register account', 400)
        
        if (!user.isVerified){
            if (user.otpCode.toString() !== otp) throw new ErrorRes('Verified code is incorrect', 400)

            user.isVerified = true
            user.otpCode = 0
            await user.save()
        }

        const apiRes = new ApiRes().setSuccess('Email verified')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
} 

//POST /auth/password/forgot
exports.forgotPassword = async (req, res, next)=>{
    const {email} = req.body
    try{
        const user = await Users.findOne({email})
        if (!user) throw new ErrorRes('User not register account', 400)
        
        user.otpCode = genOtp()
        await user.save()

        await sendMail(user.email, 'Reset your password', `Your OTP is ${user.otpCode}, use to reset your password`)

        const apiRes = new ApiRes().setSuccess('Mail sent')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /auth/password/reset
exports.resetPassword = async (req, res, next)=>{
    const {email, otp, password} = req.body
    try{
        const user = await Users.findOne({email})
        if (!user) throw new ErrorRes('User not register account', 400)
        
        if (user.otpCode.toString() !== otp) throw new ErrorRes('OTP is incorrect')

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        user.password = hashPassword
        user.otpCode = 0
        user.isVerified = true
        await user.save()

        const apiRes = new ApiRes().setSuccess('Password reseted')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /auth/password/verify
exports.verifyOtp = async (req, res, next) => {
    const {email, otp} = req.body
    try{
        const user = await Users.findOne({email})
        if (!user) throw new ErrorRes('User not register account', 400)
        
        if (user.otpCode.toString() !== otp) throw new ErrorRes('OTP is incorrect')

        const apiRes = new ApiRes().setSuccess('Correct')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}