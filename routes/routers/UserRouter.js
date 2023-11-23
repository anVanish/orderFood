const {authToken, authUser, authAdmin} = require('../../middlewares/authenticatetion')
const express = require('express')
const router = express.Router()
const {getProfile, updateProfile, updatePassword, listUser, detailUser, updateUser, deleteUser, } = require('../../app/controllers/UserController')

router.use(authToken)
router.get('/me', authUser, getProfile)
router.put('/me', authUser, updateProfile)
router.patch('/me/password', authUser, updatePassword)

router.use(authAdmin)
router.get('/', listUser)
router.get('/:userId', detailUser)
router.patch('/:userId', updateUser)
router.delete('/:userId', deleteUser)

module.exports = router