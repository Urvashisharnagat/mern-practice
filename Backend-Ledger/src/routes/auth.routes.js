const express = require('express')
const authController = require('../controller/auth.controller')

const authRouter = express.Router()


authRouter.post("/register",authController.userRegisterController)
authRouter.post("/login",authController.userloginController)
authRouter.post("/logout",authController.userlogout)

module.exports = authRouter