const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,'ledger must be associated with a account'],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,'amount is required for ledger'],
        index:true,
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,'ledger must be associated with a transaction'],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:['CREDIT','DEBIT'],
            message:"type is required to maintain a ledger"
        },
        required:[true,'ledger must be associated with a type'],
        immutable:true
    }
})

function preventLedgerModiication(){
    throw new Error('ledger entries are immutable cannot be modified or deleted')
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModiication)
ledgerSchema.pre('updateOne',preventLedgerModiication)
ledgerSchema.pre('deleteOne',preventLedgerModiication)
ledgerSchema.pre('remove',preventLedgerModiication)
ledgerSchema.pre('deleteMany',preventLedgerModiication)
ledgerSchema.pre('updateMany',preventLedgerModiication)
ledgerSchema.pre('findOneAndDelete',preventLedgerModiication)
ledgerSchema.pre('findOneAndReplace',preventLedgerModiication)

const ledgerModel = mongoose.model("ledger",ledgerSchema)

module.exports = ledgerModel