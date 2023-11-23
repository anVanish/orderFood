const Users = require('../models/Users')
const ApiRes = require("../utils/ApiRes")
const ErrorRes = require("../utils/ErrorRes")
const bcrypt = require('bcryptjs')


//GET /users/me
exports.getProfile = async (req, res, next) => {
    try{
        const user = await Users.findOne({_id: req.user._id})
        if (!user) throw new ErrorRes('User not found', 404)

        const {password, ...profile} = user.toObject()
        const apiRes = new ApiRes().setData('user', profile)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PUT /users/me
exports.updateProfile = async (req, res, next) => {
    try{
        const user = await Users.findOneAndUpdate({_id: req.user._id}, filterAddUpdateUser(req.body), {new: true})
        if (!user) throw new ErrorRes('User not found', 404)

        const {password, ...profile} = user.toObject()
        const apiRes = new ApiRes().setData('user', profile).setSuccess('User updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PATCH /users/me/password
exports.updatePassword = async (req, res, next) => {
    try{
        const {password} = req.body
        const salt = bcrypt.genSaltSync()
        const hashedPassword = bcrypt.hashSync(password, salt)
        const user = await Users.findOneAndUpdate({_id: req.user._id}, {password: hashedPassword}, {new: true})
        if (!user) throw new ErrorRes('User not found', 404)

        const apiRes = new ApiRes().setSuccess('Password updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//admin
//GET /users
exports.listUser = async (req, res, next) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 6
    const search = req.query.search || ''
    let filter = {}
    if (search)
        filter = {'name': { $regex: `.*${search}.*`, $options: 'i' }}
    try{
        const users = await Users.find(filter)
            .sort({updatedAt: -1})
            .limit(limit)
            .skip((page - 1) * limit)
        
        const usersObject = users.map(user => {
            const {password, ...other} = user.toObject()
            return other
        })
        const count = await Users.countDocuments(filter)
        const apiRes = new ApiRes()
            .setData('count', count)
            .setData('users', usersObject)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//GET /users/:userId
exports.detailUser = async (req, res, next) => {
    try{
        const user = await Users.findOne({_id: req.params.userId})
        if (!user) throw new ErrorRes('User not found', 404)

        const {password, ...profile} = user.toObject()
        const apiRes = new ApiRes().setData('user', profile)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PUT /users/:userId
exports.updateUser = async (req, res, next) => {
    try{
        const user = await Users.findOneAndUpdate({_id: req.user._id}, req.body, {new: true})
        if (!user) throw new ErrorRes('User not found', 404)
        
        const {password, ...profile} = user.toObject()
        
        const apiRes = new ApiRes().setData('user', profile).setSuccess('User updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//DELETE /users/:userId
exports.deleteUser = async (req, res, next) => {
    try{
        const user = await Users.findOneAndDelete({_id: req.params.userId})
        if (!user) throw new ErrorRes('User not found', 404)

        const apiRes = new ApiRes().setSuccess('User deleted')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

function filterAddUpdateUser(user){
    const filteredUser = {}
    if (user.name) filteredUser.name = user.name
    if (user.address) filteredUser.address = user.address
    if (user.phone) filteredUser.phone = user.phone
    return filteredUser
}

