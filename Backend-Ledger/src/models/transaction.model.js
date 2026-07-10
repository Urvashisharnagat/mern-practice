const mongoose  = require('mongoose')

const transactionScheme = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"transaction must be associated with account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"transaction must be associated with account"],
        index:true
    },
    status:{
        type:String,
        enum:{ values:['PENDING','COMPLETED','FAILED','REVERSED'],
            message:"transaction status can be either pending, completed, failed, or reversed"},
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"amount is required for transaction"],
        min:[0,"transaction amount cannot be negative"]
    },
    idempotencykey:{
        type:String,
        required:[true,"indempotency key is requires for a transaction"],
        index:true,
        unique:true
    }
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transactionScheme)

module.exports = transactionModel