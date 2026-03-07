import jwt from "jsonwebtoken";
import {User_model} from '../modules/user/user.model.js'

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ status: "fail", message: "No token provided" });
      
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User_model.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ status: "fail", message: "User not found" });
     
    }

    req.user = user;
    next(); 
  } catch (err) {
    next(err); 
  }
};