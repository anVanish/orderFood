const express = require('express')
const router = express.Router()
const {login, register, verify, forgotPassword, resetPassword, verifyOtp} = require('../../app/controllers/AuthController')

router.post('/login', login)
router.post('/register', register)
router.post('/verify', verify)
router.post('/password/forgot', forgotPassword)
router.post('/password/reset', resetPassword)
router.post('/password/verify', verifyOtp)

module.exports = router