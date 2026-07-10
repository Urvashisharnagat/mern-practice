const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken')
const EmailService = require('../services/email.service')
const tokenblacklistModel = require('../models/blacklist.model')

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req,res) {
    const {email,name,password} = req.body

    const isExist = await userModel.findOne({
        email:email
    })

    if(isExist){
        return res.status(422).json({
            message:"this email already exist",
            status:"failed"
        })
    }
   
    const user = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    

    res.status(201).json({
        message:"user registerd successfully",
        user:{
            username:user.name,
            email:user.email,
            password:user.password
        }
    })

     await EmailService.sendregistrationEmail(user.email, user.name)

}

/**
 * - user login Controller
 * - POST /api/auth/login
 */
async function userloginController(req,res){
    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"INVALID username or password"
        })
    }

    const iscorrectPassword = user.comparePassword(password)

    if(!iscorrectPassword){
         return res.status(401).json({
            message:"INVALID username or password"
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    return res.status(200).json({
        message:"user logged in successfully",
        user:{
            username:user.name,
            email:user.email,
        },
        token
    })

}

/**
 * - POST/api/auth/logout
 */
async function userlogout(req,res) {
    const token = req.cookies.token||req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).json({
            message:"user logged out successfully"
        })
    }

    await tokenblacklistModel.create({
        token
    })

    res.clearCookie("token")
    return res.status(201).json({
        message:"user logged out successully"
    })
}

module.exports = {
    userRegisterController,
    userloginController,
    userlogout
}