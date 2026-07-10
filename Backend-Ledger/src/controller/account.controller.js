const accountModel = require('../models/account.model')

async function createAccount(req,res){
    const user = req.user

    const account = await accountModel.create({
        user:user._id
    })
    res.status(201).json({
        message:'account created successfully',
        account:{
            account
        }
    })
}

async function getAllAccount(req,res){
    const accounts = await accountModel.find({
        user:req.user._id
    })
    return res.status(200).json({
        accounts
    })
}

async function getAccountBalance(req,res){
    const {accountID} = req.params
    const account = await accountModel.findOne({
        _id:accountID,
        user:req.user._id
    })
    if(!account){
        return res.sattus(404).json({
            message:"account not found"
        })
    }
    const balance = await account.getBalance()

    return res.status(200).json({
        accountID,
        balance
    })
}

module.exports ={
    createAccount,
    getAllAccount,
    getAccountBalance
}