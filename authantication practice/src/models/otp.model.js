import mongoose from "mongoose";

const otpschema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true,"user is required"]
    },
    otpHash:{
        type:String,
        required:[true,"OTP is required"]
    }
})

const otpModel = mongoose.model("otp",otpschema)

export default otpModel;