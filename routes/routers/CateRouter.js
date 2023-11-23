const {authToken, authUser, authAdmin} = require('../../middlewares/authenticatetion')
const express = require('express')
const router = express.Router()
const {listCates, addCate, updateCate, deleteCate} = require('../../app/controllers/CategoryController')

router.get('/', listCates)
router.use(authToken, authAdmin)
router.post('/', addCate)
router.put('/:id', updateCate)
router.delete('/:id', deleteCate)

module.exports = router