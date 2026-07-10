const mongoose = require('mongoose')

const tokenblacklistSchema  = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required for blacklisting"],
        unique:[true,"token is aleready blacklisted"]
    }
},{timestamps:true})

tokenblacklistSchema.index({createdAt:1},
    {expireAfterSeconds: 60*60*23*3}
)

const tokenblacklistModel = mongoose.model("tokenblaclist",tokenblacklistSchema)

module.exports = tokenblacklistModel