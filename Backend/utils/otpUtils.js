const crypto = require('crypto');

const generateOTP = (length=6) => {
    return crypto.randomInt(100000,999999).toString();
};

const otpstore = new Map();

const saveOTP = (email, otp) => {
    otpstore.set(email, {otp, expiresAT: Date.now()+ process.env.OTP_EXPIRY*60*1000});
};

const verifyOTP = (email, otp) => {
    const data = otpstore.get(email);
    if(!record)return false;
    if(record.otp !== otp) return false;
    if(Date.now()   > record.expiresAT){
        otpstore.delete(email); // clean up expired otp
        return false;
    }
    otpstore.delete(email);// Remove OTP after use
    return true;
};

module.exports = {generateOTP, saveOTP, verifyOTP};