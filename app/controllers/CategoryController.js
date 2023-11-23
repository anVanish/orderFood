const Categories = require('../models/Categories')
const ApiRes = require('../utils/ApiRes')
const ErrorRes = require('../utils/ErrorRes')

//GET /categories
exports.listCates = async (req, res, next) => {
    try{
        const cates = await Categories.find({})
            .sort({updatedAt: -1})
        const count = await Categories.countDocuments({})

        const apiRes = new ApiRes()
            .setData('count', count)
            .setData('cates', cates)
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//POST /categories
exports.addCate = async (req, res, next) => {
    try{
        const cate = new Categories(req.body)
        await cate.save()
        const apiRes = new ApiRes().setData('cate', cate).setSuccess('Category added')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//PUT /categories/:id
exports.updateCate = async (req, res, next) => {
    try{
        const cate = await Categories.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        if (!cate) throw new ErrorRes('Category not found', 404)
        const apiRes = new ApiRes().setData(['cate'], cate).setSuccess('Category updated')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}

//DELETE /categories/:id
exports.deleteCate = async (req, res, next) => {
    try{
        const cate = await Categories.findOneAndDelete({_id: req.params.id})
        if (!cate) throw new ErrorRes('Category not found', 404)
        const apiRes = new ApiRes().setSuccess('Category deleted')
        res.json(apiRes)
    }catch(error){
        next(error)
    }
}
