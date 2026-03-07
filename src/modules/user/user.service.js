import { now } from "mongoose";
import { sendOTPEmail } from "../../utils/email_service.js";
import { generateOTP } from "../../utils/otp.js";
import {  User_model } from "./user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
export const signup=async(req,res)=>{
 let {name,password,email}=req.body;
 //check if user already exist
 let existingEmail = await User_model.findOne({ email });
if (existingEmail) {
  return res.status(400).json({
    status: "fail",
    message: "Email already exists"
  });
}

let existingName = await User_model.findOne({ name });
if (existingName) {
  return res.status(400).json({
    status: "fail",
    message: "Username already exists"
  });
}
      //generate random otp
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, +process.env.saltRounds);
    const hashedPassword = await bcrypt.hash(password, +process.env.saltRounds);
     password=await bcrypt.hash(password,+process.env.saltRounds)
    // create new user
   let user = await User_model.create({ name, password, email, password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    });

    //send email
    let emails=await sendOTPEmail(user.email,otp)
    console.log(emails)
    
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
      }
    });
}


//resend_otp
export const resend_otp = async (req, res, next) => {
    const user = await User_model.findOne({ email: req.body.email }); 
    if (!user) {
      return res.status(400).json({ status: "fail", message: "User not found" });
    }
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, +process.env.saltRounds);

    await user.updateOne({
      otp: hashedOtp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });
    await sendOTPEmail(user.email, otp);
    res.json({ status: "success", message: "OTP sent successfully" });
  
};


//verify_account
export const verify_account = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User_model.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ status: "fail", message: "Account already verified" });
    }

    if (user.otpExpiry < Date.now()) { 
      return res.status(400).json({ status: "fail", message: "OTP expired, request a new one" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp); 
    if (!isMatch) {
      return res.status(400).json({ status: "fail", message: "Invalid OTP" });
    }

    await user.updateOne({ isVerified: true, otp: null, otpExpiry: null }); 

    res.json({ status: "success", message: "Account verified successfully" });
  } 



  //login
  export const login = async (req, res) => {
  let filter={}
  if(req.body.name){
     filter.name=req.body.name
  }
   if(req.body.email){
     filter.email=req.body.email
  }

  const user = await User_model.findOne(filter);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid username or password"
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      status: "fail",
      message: "Please verify your email first"
    });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid username or password"
    });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    status: "success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });

};

export const refreshAccessToken = async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token"
    });
  }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    });

    res.json({
      message: "New access token created"
    });

};

  //forget password---->use resend_otp function
export const forget_password=async(req,res)=>{
 const { email ,otp,new_password} = req.body;
    const user = await User_model.findOne({email});
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
  if (user.otpExpiry < Date.now()) { 
      return res.status(400).json({ status: "fail", message: "OTP expired, request a new one" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp); 
    if (!isMatch) {
      return res.status(400).json({ status: "fail", message: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(new_password, +process.env.saltRounds);
    await User_model.updateOne({email},{password:hashedPassword}); 
    res.json({ status: "success", message: "password updated successfully" });

  }


  //user profile
  export const getuser=async (req,res)=>{

   res.json({ status: "success", user: req.user });


  }













  //logout
  export const logout = async(req,res)=>{

  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")

  res.json({
    message:"logged out"
  })

}