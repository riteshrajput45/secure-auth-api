const User = require('../model/userModel')
const globalCalls = require('../utils/globalCalls')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const sendEmail = require('../utils/sendEmail');
const signup = async(req,res)=>{
    try {
        const {name,email,password} =req.body;
        console.log(name)
        console.log(email)
        console.log(password)
        if(!name || !email || !password){
            return globalCalls.badRequest(res,"All field is required")
        }
    const  existingUser = await User.findOne({email})
    if(existingUser){
        return globalCalls.badRequest(res,"email is already registred")
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return globalCalls.successData(res, "User registered successfully", user);

    } catch (error) {
        return globalCalls.serverError(res, error.message);
    }
}

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
      return globalCalls.badRequest(res, "Email and password are required");
    
    const user = await User.findOne({ email });
    if (!user)
    return globalCalls.badRequest(res, "Invalid credentials");

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch)
return globalCalls.badRequest(res, "Invalid credentials");

const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "5m" } // 5 minutes expiry
    );
    console.log(">>>")
    console.log("token --",token)
  
      return globalCalls.successData(res, "Login successful", { token });
    } catch (error) {
      return globalCalls.serverError(res, error.message);
    }
  };


  const resetPassword = async (req, res) => {
    try {
      const resetToken = req.params.token;
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user)
        return globalCalls.badRequest(res, "Token is invalid or expired");
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      return globalCalls.successData(res, "Password changed successfully");
    } catch (error) {
      return globalCalls.serverError(res, error.message);
    }
  };

   const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user)
        return globalCalls.badRequest(res, "User not found with this email");
  
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
  
      // Save hashed token in DB
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min valid
      await user.save({ validateBeforeSave: false });
  
      const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
  
      const message = `
        <h3>Hello ${user.name},</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password (valid for 10 minutes):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `;
    console.log("shree")
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });
  console.log("radha")
      return globalCalls.successData(res, "Password reset link sent to your email");
    } catch (error) {
      console.log(error.stack)
      return globalCalls.serverError(res, error.message);
    }
  };
  
module.exports ={signup,login,resetPassword,forgotPassword}