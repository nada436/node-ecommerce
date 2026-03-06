export const generateOTP = () =>{
 let otp= Math.floor(1000 + Math.random() * 9000).toString();
return otp}