const {authToken, authUser, authAdmin} = require('../../middlewares/authenticatetion')
const express = require('express')
const router = express.Router()
const {listCarts, addCart, updateCart, deleteCart} = require('../../app/controllers/CartController')

router.use(authToken, authUser)
router.get('/', listCarts)
router.post('/', addCart)
router.put('/:id', updateCart)
router.delete('/:id', deleteCart)

module.exports = router