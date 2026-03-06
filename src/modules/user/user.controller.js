import express, { Router } from "express";
import { catchAsync } from "../../midleware/errorHandler.middleware.js";
import { forget_password, getuser, login, logout, refreshToken, resend_otp, signup, verify_account } from "./user.service.js";
import { validate } from "../../midleware/validate.middleware.js";
import {forget_passwordSchema, loginSchema, resendOtpSchema, userValidationSchema, verifySchema} from "./user.validation.js";
import { auth } from "../../midleware/auth.middleware.js";
export const user_routes = Router(); 

user_routes.post("/signup",validate(userValidationSchema),catchAsync(signup))
user_routes.post("/resend_otp",validate(resendOtpSchema),catchAsync(resend_otp))
user_routes.post("/verify_account",validate(verifySchema),catchAsync(verify_account))
user_routes.post("/login",validate(loginSchema),catchAsync(login))
user_routes.post("/forget_password",validate(forget_passwordSchema),catchAsync(forget_password))
user_routes.get("/myprofile",catchAsync(auth),catchAsync(getuser))
user_routes.get("/logout",catchAsync(auth),catchAsync(logout))
user_routes.get("/refreshToken",catchAsync(auth),catchAsync(refreshToken))

// user_routes.patch("/:id",catchAsync())
// user_routes.delete("/:id",catchAsync())

//edit user data
//signup(google)