const Foods = require('../models/Foods')
const ApiRes = require('../utils/ApiRes')

//GET /foods
exports.listFood = async (req, res, next) => {
    try{
        const foods = await Foods.find({})
        const apiRes = new ApiRes().setData('foods', foods)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//GET /foods/:slug
exports.detailFood = async (req, res, next) => {
    const {slug} = req.body
    try{
        const food = await Foods.find({slug})
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
        const apiRes = new ApiRes().setData(['food'], food).setSuccess('Food added')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PATCH /foods/:slug
exports.updateFood = async (req, res, next) => {
    try{
        const food = await Foods.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true})
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
        const apiRes = new ApiRes().setSuccess('Food deleted')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}
