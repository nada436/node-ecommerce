import express, { Router } from "express";
import { catchAsync } from "../../midleware/errorHandler.middleware.js";
import { login, resend_otp, signup, verify_account } from "./user.service.js";
import { validate } from "../../midleware/validate.middleware.js";
import {resendOtpSchema, userValidationSchema, verifySchema} from "./user.validation.js";
const app = express(); 
export const user_routes = Router(); 

user_routes.post("/signup",validate(userValidationSchema),catchAsync(signup))
user_routes.post("/resend_otp",validate(resendOtpSchema),catchAsync(resend_otp))
user_routes.post("/verify_account",validate(verifySchema),catchAsync(verify_account))
 user_routes.post("/login",catchAsync(login))
// user_routes.get("/:id",catchAsync())
// user_routes.patch("/:id",catchAsync())
// user_routes.delete("/:id",catchAsync())
