import jwt from "jsonwebtoken";
import {User_model} from '../modules/user/user.model.js'


export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!token) {
      if (!refreshToken) {
        return res.status(401).json({ status: "fail", message: "No tokens provided" });
      }
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_model.findById(decodedRefresh.id);

        if (!user) {
          return res.status(401).json({ status: "fail", message: "User not found" });
        }

        // Create new access token
        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Set the new access token in cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production"
        });

        req.user = user; 
        return next();

      } catch (err) {
        return res.status(403).json({ status: "fail", message: "Invalid refresh token" });
      }
    }

    // Normal access token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User_model.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ status: "fail", message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    // If token expired, try to refresh automatically
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_model.findById(decodedRefresh.id);

        if (!user) {
          return res.status(401).json({ status: "fail", message: "User not found" });
        }

        // Issue new access token
        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production"
        });

        req.user = user;
        return next();

      } catch {
        return res.status(403).json({ status: "fail", message: "Refresh token invalid or expired" });
      }
    }

    next(err); 
  }
};