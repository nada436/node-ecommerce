import z from "zod";

export const userValidationSchema = z.object({
  name: z.string().min(2, "Name should have at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should have at least 6 characters"),
  
});

export const resendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(4, "OTP must be 4 digits"),
});

