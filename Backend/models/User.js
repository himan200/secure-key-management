const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt  = require("jsonwebtoken")


const userSchema = new mongoose.Schema({

    fullname:{
        firstname:{
            type: String,
            required: true,
            minlength: [3,'First name must be at least 3 characters']
        },
        lastname:{
            type: String,
            minlength: [3,'Last name must be at least 3 characters']
        }
    },
    date_of_birth:{
        type:Date,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
        select: false,
    },
})

userSchema.methods.generateAuthToken = async function(){
    const token =jwt.sign({_id:this._id},process.env.JWT_SECRET);
    return token;
}

userSchema.methodscomparePassword = async function(Password){
    return await bcrypt.compare(Password,this.password);
}

userSchema.statics.hashPassword = async function(Password){
    return await bcrypt.hash(Password,12);
}

const user = mongoose.model('User',userSchema);
module.exports = user;