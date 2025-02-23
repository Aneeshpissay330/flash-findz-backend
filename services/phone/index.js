const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendVerificationSMS = async (phoneNumber, verificationCode) => {
    try {
        const message = await client.messages.create({
            body: `Your Flash Findz verification code is: ${verificationCode}. This code will expire in 1 hour.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log('📱 Verification SMS sent successfully:', message.sid);
    } catch (error) {
        console.error('❌ SMS sending error:', error);
    }
};

module.exports = sendVerificationSMS;