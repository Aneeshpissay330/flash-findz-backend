const User = require('../../models/User');
const Log = require('../../models/Log');

exports.getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Invalid token data' });
    }

    // Fetch only required fields
    const user = await User.findById(req.user._id).select('firstName lastName email phoneNumber isVerified');

    if (!user) {
      await Log.createLog('warn', `User not found for ID: ${req.user._id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error); // Debugging log
    res.status(500).json({ message: 'Server error', error });
  }
};
