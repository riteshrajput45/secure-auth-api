const User = require('../model/userModel')
const globalCalls = require('../utils/globalCalls')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

module.exports ={signup,login}