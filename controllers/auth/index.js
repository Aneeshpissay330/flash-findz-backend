const User = require('../../models/User');
const sendVerificationEmail = require('../../services/email');
const sendVerificationSMS = require('../../services/phone');
const Log = require('../../models/Log'); // Log model

// Register User
exports.registerUser = async (req, res) => {
  // #swagger.tags = ['Authentication']
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    let user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

    if (user) {
      // Log user already exists
      await Log.createLog('warn', `User already exists with email: ${email} or phone: ${phoneNumber}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ firstName, lastName, email, password, phoneNumber });
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Log user registration success
    await Log.createLog('info', `New user registered: ${email}`);

    // Send verification code
    await sendVerificationEmail(email, verificationCode);
    await sendVerificationSMS(phoneNumber, verificationCode);
    // Log email sent
    await Log.createLog('info', `Verification email sent to ${email}`);

    res.status(200).json({ message: 'Verification code sent to email or phone' });
  } catch (error) {
    // Log error
    await Log.createLog('error', 'Error during user registration', { errorMessage: error.message, stackTrace: error.stack });
    res.status(500).json({ message: 'Server error', error });
  }
};

// Verify User
exports.verifyUser = async (req, res) => {
  // #swagger.tags = ['Authentication']
  try {
    const { email, phoneNumber, verificationCode } = req.body;

    // Log verification attempt
    await Log.createLog('info', `Verification attempt for email: ${email} or phone: ${phoneNumber}`);

    // Check that at least one identifier (email or phone number) is provided
    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (!user) {
      // Log user not found
      await Log.createLog('warn', `User not found for email: ${email} or phone: ${phoneNumber}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the verification code
    if (user.verificationCode !== verificationCode || Date.now() > user.verificationExpires) {
      // Log invalid or expired verification code
      await Log.createLog('warn', `Invalid or expired verification code for user: ${email}`);
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    // Log successful verification
    await Log.createLog('info', `User successfully verified: ${email}`);

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    // Log error
    await Log.createLog('error', 'Error during user verification', { errorMessage: error.message, stackTrace: error.stack });
    res.status(500).json({ message: 'Server error', error });
  }
};

// Request New Verification Code
exports.requestNewVerificationCode = async (req, res) => {
  // #swagger.tags = ['Authentication']
  /* #swagger.security = [{
            "Bearer": []
    }] */
  try {
    const { email, phoneNumber } = req.body;

    // Log request for new verification code
    await Log.createLog('info', `Request for new verification code received for email: ${email} or phone: ${phoneNumber}`);

    // Check if the user exists
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) {
      // Log user not found
      await Log.createLog('warn', `User not found for email: ${email} or phone: ${phoneNumber}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new verification code
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Log new verification code generated
    await Log.createLog('info', `New verification code generated for user: ${email}`);

    // Send the new verification code to the user
    await sendVerificationEmail(email, verificationCode);

    // Log email sent
    await Log.createLog('info', `New verification email sent to ${email}`);

    res.status(200).json({ message: 'New verification code sent' });
  } catch (error) {
    // Log error
    await Log.createLog('error', 'Error during new verification code request', { errorMessage: error.message, stackTrace: error.stack });
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  // #swagger.tags = ['Authentication']
  try {
    const { email, phoneNumber, password } = req.body;

    // Log login attempt
    await Log.createLog('info', `Login attempt for email: ${email} or phone: ${phoneNumber}`);

    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

    if (!user || !(await user.comparePassword(password))) {
      // Log invalid credentials
      await Log.createLog('warn', `Invalid login attempt for email: ${email} or phone: ${phoneNumber}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      // Log unverified account
      await Log.createLog('warn', `Unverified account login attempt for email: ${email}`);
      return res.status(400).json({ message: 'Account not verified' });
    }

    const token = user.generateAuthToken();

    // Log successful login
    await Log.createLog('info', `User logged in successfully: ${email}`);

    res.status(200).json({ token });
  } catch (error) {
    // Log error
    await Log.createLog('error', 'Error during user login', { errorMessage: error.message, stackTrace: error.stack });
    res.status(500).json({ message: 'Server error', error });
  }
};
