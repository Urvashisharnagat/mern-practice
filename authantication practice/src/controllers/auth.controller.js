import userModel from "../models/users.model.js";
import crypto, { hash } from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { senEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";

export async function register(req,res) {

    const {username, email, password} = req.body;

    const isuseralreadyexist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    
    if(isuseralreadyexist){
        res.status(409).json({
            message: "username or email already exist"
        })
    }

    const hashpassword = crypto.createHash("sha256").update(password).digest("hex")

    const user = await userModel.create({
        username,
        email,
        password:hashpassword
    })

    const otp = generateOtp()
    const html = getOtpHtml(otp)
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    await otpModel.create({
        email,
        user:user._id,
        otpHash
    })

    await senEmail(email,"OTP verification", `Your OTP is ${otp}`, html)

    res.status(201).json({
        message:"user registerd successully",
        user:{
            username: user.username,
            email: user.email,
            verified: user.verifyed
        }
    })
}

export async function login(req,res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message:"this email dosen't exist"
        })
    }
    if(!user.verifyed){
        return res.status(401).json({
            message:"user not verifyed"
        })
    }
    const hashpassword = crypto.createHash("sha256").update(password).digest("hex")

    const isvalidpassword = hashpassword === user.password

    if(!isvalidpassword){
        return res.status(401).json({
            message:"email or password is incorrect"
        })
    }

    const refreshToken = jwt.sign({id:user._id},config.JWT_SECRET,{
        expiresIn:"7d"
    })
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"],
    })

    res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:true,
    samesite:"strict",
    maxAge:7*24*60*60*1000
   })

    const accessToken = jwt.sign({id:user._id,sessionId:session._id},config.JWT_SECRET,{
        expiresIn:"15m"
    })

    return res.status(200).json({
        message:"user loggedin successfully",
        user:{
            username:user.username,
            email:user.email,
            verifyed:user.verifyed
        }
    })

}

export async function getme(req,res) {
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(401).json({
            message:"you can not acces the content"
        })
    }

    const decoded = jwt.verify(token,config.JWT_SECRET)
    const user = await userModel.findById(decoded.id)
    res.status(200).json({
        message:"user find successfully",
        
        user: {username: user.username,
        email: user.email},
        decoded
    })
}

export async function refreshtoken(req,res){
   const refreshToken = req.cookies.refreshToken

   if(!refreshToken){
    return res.status(401).json({
        message:"token not found"
    })
   }

   const decoded = jwt.verify(refreshToken,config.JWT_SECRET)
 
   const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

   const session = await userModel.findOne({
    refreshTokenHash,
    Revoked:false
   })

   if(!session){
    return res.status(401).json({
        message:"cannot generet access token"
    })
   }

   const accessToken = jwt.sign({id:decoded.id},config.JWT_SECRET,{expiresIn:'15m'})
   const newrefreshToken = jwt.sign({id:decoded.id},config.JWT_SECRET,{
    expiresIn:"7d"
   })

   const newrefreshTokenhash = crypto.createHash("sha256").update(newrefreshToken).digest("hex")
   session.refreshTokenHash = newrefreshTokenhash
   await session.save()

   res.cookie("refreshToken",newrefreshToken,{
    httpOnly:true,
    secure:true,
    samesite:"strict",
    maxAge:7*24*60*60*1000
   })

   res.status(200).json({
    message:"new access token genreted",
    accessToken
   })

}

export async function logout(req,res) {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(400).json({
            message:"token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModelv6.findOne({
        refreshTokenHash:refreshTokenHash,
        Revoked:false
    })

    if(!session){
        return res.status(401).json({
            message:"invalid refreshTokebn"
        })
    }

    session.Revoked = true
    await session.save()

    res.clearCookie("refreshToken")

    return res.status(200).json({
        message:"user logged out sueccessfully"
    })

}

export async function logoutall(req,res) {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            message:"token not found"
        })
    }

    const decoded = jwt.verify(refreshToken,config.JWT_SECRET)

    await sessionModel.updateMany({
        user:decoded.id,
        Revoked:false
    },{
        Revoked:true
    })

    res.clearCookie("refreshToken")
    return res.status(200).json({
        message:"logged out from all devices"
    })
}

export async function verifyemail(req,res) {
    const{ otp, email} = req.body
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")
    const otpdoc = await otpModel.findOne({
        email,
        otpHash
    })
    if(!otpdoc){
        return res.status(400).json({
            message:"invalid OTP"
        })
    }
    
    const user = await userModel.findByIdAndUpdate(otpdoc.user,{
        verifyed:true
    })

    await otpModel.deleteMany({
        user:otpdoc.user
    })

    return res.status(200).json({
        message:"user verifyed successfully",
        user:{
            username:user.username,
            email:user.email,
            verifyed:user.verifyed
        }
    })

}