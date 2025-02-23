const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Flash Findz Verification Code',
        html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #4CAF50;">Flash Findz Verification Code</h2>
              <p>Hello,</p>
              <p>Thank you for registering with Flash Findz. Please use the following verification code to confirm your registration:</p>
              <h3 style="color: #333; font-size: 24px; font-weight: bold;">${verificationCode}</h3>
              <p>This code will expire in 1 hour, so please enter it as soon as possible.</p>
              <p>If you did not request this, please ignore this email.</p>
              <div style="margin-top: 30px; font-size: 0.9em; color: #777;">
                <p>Thank you for using Flash Findz!</p>
                <p>The Flash Findz Team</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Verification email sent successfully.');
    } catch (error) {
        console.error('❌ Email sending error:', error);
    }
};


module.exports = sendVerificationEmail;
