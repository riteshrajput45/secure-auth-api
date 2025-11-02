const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   resetPasswordToken: String,
   resetPasswordExpire: Date,
},{timeStamps:true})

const user = mongoose.model('user',userSchema)

module.exports =   user