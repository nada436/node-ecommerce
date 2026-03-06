import { transporter } from "../config/mailer.js";


export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"ecommerce App" <nada.nasr436@gmail.com>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>Your Verification Code</h2>
        <p>Use the code below to verify your account:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">
          ${otp}
        </div>
        <p style="color: #999; margin-top: 16px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};