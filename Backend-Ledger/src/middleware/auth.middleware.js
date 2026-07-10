const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

async function authUser(req,res,next){
    const token = req.cookies.token||req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"unauthorized access token is missing"
        })
    }

    const isBlacklist = await tokenBlacklistModel.findOne({token})

    if(isBlacklist){
        return res.status(401).json({
            message:"unauthorized access , token is invalid"
        })
    }

    try{
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       const user = await userModel.findById(decoded.id)
       req.user = user
       next()
    }catch{
       return res.status(401).json({
        message:"unauthorized access token is INVALID"
       })
    }
}

async function authsystemUser(req,res,next){
    const token = req.cookies.token||req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"unauthorized access token is missing"
        })
    }
    
    const isBlacklist = await tokenBlacklistModel.findOne({token})

    if(isBlacklist){
        return res.status(401).json({
            message:"unauthorized access , token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message:"forbidden access, not a system User"
            })
        }
        req.user = user
        return next()
    }
    catch(err){
        return res.status(401).json({
           message:"unauthorized access , token is invalid",
           error:err
        })
    }
}

module.exports = {
    authUser,
    authsystemUser
}