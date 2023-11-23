const {authToken, authUser, authAdmin} = require('../../middlewares/authenticatetion')
const express = require('express')
const router = express.Router()
const {listOrders, addOrder, deleteOrder, listOrdersUser, addOrderUser, updateOrderUser, deleteOrderUser, checkout} = require('../../app/controllers/OrderController')

router.use(authToken)
router.get('/', authUser, listOrders)
router.get('/checkout', authUser, checkout)
router.post('/', authUser, addOrder)
router.delete('/:id', authUser, deleteOrder)

router.use(authAdmin)
router.get('/user/:userId', listOrdersUser)
router.post('/user/:userId', addOrderUser)
router.patch('/:id/user/:userId', updateOrderUser)
router.delete('/:id/user/:userId', deleteOrderUser)

module.exports = router