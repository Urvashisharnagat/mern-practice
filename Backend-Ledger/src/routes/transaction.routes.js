const {Router} =  require('express')
const authMiddleware = require('../middleware/auth.middleware')
const transactionController = require('../controller/transaction.controller')

const transactionRouter = Router();

/**
 * - POST/api/system/initial-funds
 * - create initial fund transaction
 */
transactionRouter.post("/system/initial-funds",authMiddleware.authsystemUser,transactionController.createInitialFundTransaction)

/**
 * - POST/api/transaction
 * - transfer money from one to another account
 */
transactionRouter.post("/",authMiddleware.authUser,transactionController.createTransaction)

module.exports = transactionRouter