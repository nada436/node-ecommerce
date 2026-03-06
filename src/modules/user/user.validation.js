import z from "zod";

let user_data={
  name: z.string().min(2, "Name should have at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should have at least 6 characters"),
  otp: z.string().length(6, "OTP must be 4 digits")
}
export const userValidationSchema = z.object({
  name:user_data.name,
  email: user_data.email,
  password: user_data.password
  
});

export const resendOtpSchema = z.object({
  email: user_data.email
});

export const verifySchema = z.object({
  email:user_data.email,
  otp: user_data.otp
});

export const loginSchema = z.object({
 password: user_data.password,
  name:user_data.name
});

export const forget_passwordSchema = z.object({
  email:  user_data.email,
  new_password:user_data.password,
  otp:user_data.otp
});



