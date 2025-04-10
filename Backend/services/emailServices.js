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
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #646cff;
            text-align: center;
        }
        p {
            font-size: 16px;
            color: #555;
            text-align: center;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #646cff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            text-align: center;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #5a5ee0;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to SecureKey!</h1>
        <p>Please click the link below to verify your email address and complete your registration process:</p>
        <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
        <div class="footer">
            <p>If you did not create an account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`,
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
    html: `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f9fc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 30px;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #eaeaea;
      }
      .header h2 {
        margin: 0;
        color: #2e86de;
      }
      .content {
        padding-top: 20px;
        text-align: center;
      }
      .otp-box {
        display: inline-block;
        background-color: #f1f3f5;
        padding: 12px 24px;
        font-size: 24px;
        letter-spacing: 3px;
        border-radius: 6px;
        font-weight: bold;
        margin: 20px 0;
        color: #111;
      }
      .footer {
        text-align: center;
        color: #888;
        font-size: 12px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Secure Key Management</h2>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Use the OTP below to complete your login. This code is valid for <strong>5 minutes</strong>.</p>
        <div class="otp-box">${otp}</div>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Secure Key Management. All rights reserved.
      </div>
    </div>
  </body>
</html>
`
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Export functions properly
const sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    to: email,
    subject: 'Password Reset - Secure Key Management',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 10px 20px; 
      background-color: #646cff; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your Secure Key Management account.</p>
    <p>Click the button below to reset your password (link expires in 1 hour):</p>
    <p><a href="${resetUrl}" class="button">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>`
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetConfirmation = async (email) => {
  const mailOptions = {
    to: email,
    subject: 'Password Reset Successful - Secure Key Management',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .success-message { 
      color: #28a745;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Successfully Reset</h2>
    <p class="success-message">Your Secure Key Management account password has been successfully reset.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
    <p>Thank you,<br>The Secure Key Management Team</p>
  </div>
</body>
</html>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset confirmation:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendLoginOTP,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation
};
