const Orders = require('../models/Orders')
const Carts = require('../models/Carts')
const Users = require('../models/Users')
const ApiRes = require('../utils/ApiRes')
const ErrorRes = require('../utils/ErrorRes')

//GET /orders
exports.listOrders = async (req, res, next) => {
    try{
        const orders = await Orders.find({user: req.user._id})
            .sort({updatedAt: -1})
        
        const count = await Orders.countDocuments({user: req.user._id})

        const apiRes = new ApiRes()
            .setData('count', count)
            .setData('orders', orders)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//GET /orders/checkout
exports.checkout = async (req, res, next) => {
    try{
        const order = await generateOrder(req.user._id)    
        const apiRes = new ApiRes().setData('order', order)
        res.json(apiRes)
    } catch(error){
        next(error)
    }
}

//POST /orders
exports.addOrder = async (req, res, next) => {
    try{
        const order = await generateOrder(req.user._id)
        await order.save()
    
        const apiRes = new ApiRes().setData('order', order).setSuccess('Order successful')
        res.json(apiRes)
    } catch(error){
        next(error)
    }
}

//DELETE /orders/:id
exports.deleteOrder = async (req, res, next) => {
    try{
        const order = await Orders.findOne({_id: req.params.id})
        if (!order) throw new ErrorRes('Order not found', 404)
        
        if (new Date() - order.orderDate > 60000 && order.status !== 'to-ship')
            throw new ErrorRes('Order can\'t be cancel now, you only can cancel within 1 minute', 403)
        
        order.status = 'cancel'
        await order.save()
        const apiRes = new ApiRes().setSuccess('Order canceled')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}


//admin
//GET /orders/user/:userId
exports.listOrdersUser = async (req, res, next) => {
    try{
        const orders = await Orders.find({user: req.params.userId})
            .sort({updatedAt: -1})
        
        const count = await Orders.countDocuments({user: req.params.userId})

        const apiRes = new ApiRes()
            .setData('count', count)
            .setData('orders', orders)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /orders/user/:userId
exports.addOrderUser = async (req, res, next) => {
    try{
        const order = await generateOrder(req.params.userId)
        await order.save()
    
        const apiRes = new ApiRes().setData('order', order).setSuccess('Order successful')
        res.json(apiRes)
    } catch(error){
        next(error)
    }
}

//PATCH /orders/:id
exports.updateOrderUser = async (req, res, next) => {
    try{
        const order = await Orders.findOne({_id: req.params.id})
        if (!order) throw new ErrorRes('Order not found', 404)

        order.status = req.body.status
        order.statusHistory.push({
            status: order.status,
            note: req.body.note,
        })

        const apiRes = new ApiRes().setData(['order'], order).setSuccess('Order updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//DELETE /orders/:id
exports.deleteOrderUser = async (req, res, next) => {
    try{
        const order = await Orders.findOne({_id: req.params.id})
        if (!order) throw new ErrorRes('Order not found', 404)
        
        order.status = 'cancel'
        await order.save()
        const apiRes = new ApiRes().setSuccess('Order canceled')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}


async function generateOrder(userId){
    try{
        const carts = await Carts.find({user: userId})
            .sort({updatedAt: -1})
            .populate('food', '_id name image price slug category quantity')
        const user = await Users.findOne({_id: userId})
        
        const foods = carts.map(cart => {
            return {...cart.food, quantity: cart.quantity}
        })
        const order = new Orders({user, foods})
        order.shippingCost = 20000
        order.foodTotalPrice = carts.reduce((total, cart) => {
            if (cart.food && cart.food.price) return total + cart.food.price * cart.quantity
            return total
        }, 0) 
        order.totalPrice = order.shippingCost + order.foodTotalPrice
        order.statusHistory.push({
            status: order.status,
            note: 'Order successful'
        })

        return order
    } catch(error){
        return error
    }
}