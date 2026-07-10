const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"pleasw fill a valid email address"],
        unique:[true,"email allready exist"]
    },
    name:{
        type:String,
        required:[true,"name is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password should be of minimum 6 length"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timeseries:true
})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return
    }
    this.password= await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel