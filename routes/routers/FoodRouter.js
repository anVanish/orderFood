const {authToken, authUser, authAdmin} = require('../../middlewares/authenticatetion')
const express = require('express')
const router = express.Router()
const {listFood, addFood, detailFood, updateFood, deleteFood} = require('../../app/controllers/FoodController')

router.get('/', listFood)
router.get('/:slug', detailFood)

router.use(authToken, authAdmin)
router.post('/', addFood)
router.put('/:slug', updateFood)
router.delete('/:slug', deleteFood)

module.exports = router