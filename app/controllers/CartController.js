const Carts = require('../models/Carts')
const Foods = require('../models/Foods')
const ApiRes = require('../utils/ApiRes')
const ErrorRes = require('../utils/ErrorRes')

//GET /Carts
exports.listCarts = async (req, res, next) => {
    try{
        const carts = await Carts.find({user: req.user._id})
            .sort({updatedAt: -1})
            .populate('food', 'name image slug price')
        const totalPrice = carts.reduce((total, cart) => {
            if (cart.food && cart.food.price) return total + cart.food.price * cart.quantity
            return total
        }, 0)
        
        const count = await Carts.countDocuments({user: req.user._id})

        const apiRes = new ApiRes()
            .setData('count', count)
            .setData('totalPrice', totalPrice)
            .setData('carts', carts)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /Carts
exports.addCart = async (req, res, next) => {
    try{
        const food = await Foods.findOne({_id: req.body.food})
        if (!food) throw new ErrorRes('Food not found', 404)

        const apiRes = new ApiRes().setSuccess('Cart added')
        const existCart = await Carts.findOne({food: food._id})
        if (existCart){
            existCart.quantity += req.body.quantity
            await existCart.save()
            apiRes.setData('cart', existCart)
        } else {
            const cart = new Carts({...req.body, user: req.user._id})
            await cart.save()
            apiRes.setData('cart', cart)
        }
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PUT /Carts/:id
exports.updateCart = async (req, res, next) => {
    try{
        const cart = await Carts.findOneAndUpdate({_id: req.params.id}, {quantity: req.body.quantity}, {new: true})
        if (!cart) throw new ErrorRes('Cart not found', 404)
        const apiRes = new ApiRes().setData(['cart'], cart).setSuccess('Cart updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//DELETE /carts/:id
exports.deleteCart = async (req, res, next) => {
    try{
        const cart = await Carts.findOneAndDelete({_id: req.params.id})
        if (!cart) throw new ErrorRes('Cart not found', 404)
        const apiRes = new ApiRes().setSuccess('Cart deleted')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}
