
const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const mongoose = require('mongoose')
const emailService = require('../services/email.service')

/**
 * - create a new transaction
 * the 10 step flow of transaction
 * 1.validate request 
 * 2.validate idempotency key
 * 3.cheak account status
 * 4.derive sender balance from ldger
 * 5.create transaction (pending)
 * 6.create debit ledger entry
 * 7.create credit ledger entry
 * 8.Mark transaction completed
 * 9.comit mongodb session
 * 10.send email notification
 */



async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencykey } = req.body;

    // Validate request
    if (!fromAccount || !toAccount || !amount || !idempotencykey) {
        return res.status(400).json({
            message: "fromAccount, toAccount, amount and idempotencykey are required"
        });
    }

    // Find accounts
    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        });
    }

    // Prevent self-transfer
    if (fromAccount === toAccount) {
        return res.status(400).json({
            message: "Cannot transfer money to the same account"
        });
    }

    // Check idempotency key
    const existingTransaction = await transactionModel.findOne({
        idempotencykey
    });

    if (existingTransaction) {
        switch (existingTransaction.status) {
            case "COMPLETED":
                return res.status(200).json({
                    message: "Transaction already processed",
                    transaction: existingTransaction
                });

            case "PENDING":
                return res.status(200).json({
                    message: "Transaction is still processing"
                });

            case "FAILED":
                return res.status(400).json({
                    message: "Previous transaction failed. Please retry."
                });

            case "REVERSED":
                return res.status(400).json({
                    message: "Transaction was reversed. Please retry."
                });
        }
    }

    // Check account status
    if (
        fromUserAccount.status !== "ACTIVE" ||
        toUserAccount.status !== "ACTIVE"
    ) {
        return res.status(400).json({
            message: "Both accounts must be ACTIVE"
        });
    }

    // Check balance
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}`
        });
    }

    let session;

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        // Create pending transaction
        const [transaction] = await transactionModel.create(
            [
                {
                    fromAccount,
                    toAccount,
                    amount,
                    idempotencykey,
                    status: "PENDING"
                }
            ],
            { session }
        );

        // Debit sender
        await ledgerModel.create(
            [
                {
                    account: fromAccount,
                    amount,
                    transaction: transaction._id,
                    type: "DEBIT"
                }
            ],
            { session }
        );

        // Simulate processing delay (Testing only)
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Credit receiver
        await ledgerModel.create(
            [
                {
                    account: toAccount,
                    amount,
                    transaction: transaction._id,
                    type: "CREDIT"
                }
            ],
            { session }
        );

        // Update transaction status
        transaction.status = "COMPLETED";
        await transaction.save({ session });

        // Commit transaction
        await session.commitTransaction();

        // Send email after successful commit
        try {
            await emailService.sendtransactiocompleted(
                req.user.email,
                req.user.name,
                amount,
                toAccount
            );
        } catch (emailError) {
            console.error("Email Error:", emailError.message);
        }

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction
        });

    } catch (err) {

        if (session) {
            await session.abortTransaction();
        }

        console.error(err);

        return res.status(500).json({
            message: "Transaction failed",
            error: err.message
        });

    } finally {

        if (session) {
            await session.endSession();
        }
    }
}


async function createInitialFundTransaction(req, res){
    const {toAccount, amount, idempotencykey} = req.body
    if(!toAccount || !amount || !idempotencykey){
        return res.status(400).json({
            message:"toAccount, amount, idempotencykey are required "
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })
    if(!toUserAccount){
        return res.status(400).json({
            message:"invalid toAccount"
        })
    }
    
    const fromAccount = await accountModel.findOne({
        user:req.user._id
    })
    if(!fromAccount){
        return res.status(400).json({
            message:"invalid fromAccount"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    
    const transaction = new transactionModel({
        fromAccount:fromAccount._id,
        toAccount,
        amount,
        idempotencykey,
        status:"PENDING"
    })

    const creditLedgerentry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    const debitLedgerentry = await ledgerModel.create([{
        account:fromAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})
    
    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

   return res.status(201).json({
     message:`Transaction of amount ${amount} completed`
   })
}

module.exports = {
    createTransaction,
    createInitialFundTransaction
}