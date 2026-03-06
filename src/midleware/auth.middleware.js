import jwt from "jsonwebtoken";
import { User_model } from "../modules/user/user.model.js";

export const auth = async(req, res, next) => {
    const token = req.cookies.accessToken;
   const decoded =await  jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User_model.findOne({_id:decoded.id});
      if(!req.user){
         res.status(400).json({ status: "fail", message: "Invalid token" });
      }
      next();}
      