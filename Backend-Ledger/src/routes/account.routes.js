const express = require('express')
const accountRouter = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controller/account.controller')

/**
 * - POST/Api/auth/create-account
 * - create new account
 * - protected route
 */
accountRouter.post('/create-account',authMiddleware.authUser,accountController.createAccount)

/**
 * GET/api/accounts
 * get all accounts
*/
accountRouter.get('/',authMiddleware.authUser,accountController.getAllAccount)

/**
 * GET/api/account/balance/:accounID
 */
accountRouter.get('/balance/:accountID', authMiddleware.authUser,accountController.getAccountBalance)

module.exports = accountRouter