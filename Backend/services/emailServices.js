const nodemailer = require("nodemailer");

// Create transporter
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
const sendVerificationEmail = async (email, verificationUrl) => {
  try {
    console.log("Sending email to:", email);
    console.log("Verification URL:", verificationUrl);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - Secure Key Management",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
    });

    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Send login OTP
const sendLoginOTP = async (email, otp) => {
  const mailOptions = {
    to: email,
    subject: 'Your Login OTP',
    html: `<p>Your login OTP is: <b>${otp}</b>. It will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Export functions properly
module.exports = {
  sendVerificationEmail,
  sendLoginOTP,
};
