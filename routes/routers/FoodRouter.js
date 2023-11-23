const {authToken, authUser, authAdmin} = require('../../middlewares/authenticatetion')
const express = require('express')
const router = express.Router()
const {listFood, addFood, detailFood, updateFood, deleteFood} = require('../../app/controllers/FoodController')

router.get('/', listFood)
router.get('/:slug', detailFood)
router.post('/', addFood)
router.patch('/:slug', updateFood)
router.delete('/:slug', deleteFood)

module.exports = router