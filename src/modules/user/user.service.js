import { now } from "mongoose";
import { sendOTPEmail } from "../../utils/email_service.js";
import { generateOTP } from "../../utils/otp.js";
import {  User_model } from "./user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
export const signup=async(req,res)=>{
 let {name,password,email}=req.body;
 //check if user already exist
 let user = await User_model.findOne({ email });

    if (user) {
      return res.status(400).json({ status: "fail", message: "User already exists" });
    }
      //generate random otp
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, +process.env.saltRounds);
    const hashedPassword = await bcrypt.hash(password, +process.env.saltRounds);
     password=await bcrypt.hash(password,+process.env.saltRounds)
    // create new user
    user = await User_model.create({ name, password, email, password: hashedPassword,
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



export const resend_otp = async (req, res, next) => {
    const user = await User_model.findOne({ email: req.body.email }); 
    if (!user) {
      return res.status(400).json({ status: "fail", message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ status: "fail", message: "User already verified" });
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
  export const login=async(req,res)=>{
 const { password, name } = req.body;
    const user = await User_model.findOne({name});
    if (!user) {
      return res.status(404).json({ status: "fail", message: "wrong username " });
    }
    if(!user.isVerified){
         return res.status(404).json({ status: "fail", message: "User account is not verified. Please verify your email to continue" });
    }
    let is_match=bcrypt.compare(password,user.password)
    if(!is_match){
        return res.status(404).json({ status: "fail", message: "wrong password" });
    }
    let token=jwt.sign({name:user.name,email:user.email,role:user.role},process.env.JWT_SECRET)
    res.json({ status: "success",token});


  }