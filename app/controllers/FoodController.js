const Foods = require('../models/Foods')
const ApiRes = require('../utils/ApiRes')
const ErrorRes = require('../utils/ErrorRes')

//GET /foods
exports.listFood = async (req, res, next) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 6
    const search = req.query.search || ''
    const filter = {'name': { $regex: `.*${search}.*`, $options: 'i' }}
    try{
        const foods = await Foods.find(filter)
            .sort({updatedAt: -1})
            .limit(limit)
            .skip((page - 1) * limit)
        const count = await Foods.countDocuments(filter)

        const apiRes = new ApiRes()
            .setData('count', count)
            .setData('foods', foods)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//GET /foods/:slug
exports.detailFood = async (req, res, next) => {
    try{
        const food = await Foods.findOne({slug: req.params.slug})
        if (!food) throw new ErrorRes('Food not found', 404)
        const apiRes = new ApiRes().setData('food', food)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /foods
exports.addFood = async (req, res, next) => {
    try{
        const food = new Foods(req.body)
        await food.save()
        const apiRes = new ApiRes().setData('food', food).setSuccess('Food added')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PATCH /foods/:slug
exports.updateFood = async (req, res, next) => {
    try{
        const food = await Foods.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true})
        if (!food) throw new ErrorRes('Food not found', 404)
        const apiRes = new ApiRes().setData(['food'], food).setSuccess('Food updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//DELETE /foods/:slug
exports.deleteFood = async (req, res, next) => {
    try{
        const food = await Foods.findOneAndDelete({slug: req.params.slug})
        if (!food) throw new ErrorRes('Food not found', 404)
        const apiRes = new ApiRes().setSuccess('Food deleted')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}
