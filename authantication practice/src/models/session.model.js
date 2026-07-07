import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"user is required"]
    },
    refreshTokenHash:{
        type:String,
        required:[true,"refreshToken is required"]
    },
    ip:{
        type:String,
        required:[true,"ip is required"]
    },
    userAgent:{
        type:String,
        required:[true,"userAgent id required"]
    },
    Revoked:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
)

const sessionModel = mongoose.model("session",sessionSchema)

export default sessionModel;