const User = require("../../models/User");
const Log = require("../../models/Log");

// **User Registration**
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Log.createLog("warn", "User registration failed: Email already exists", { email });
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const newUser = new User({ name, email, password, phone, role, address });
    await newUser.save();

    await Log.createLog("info", "User registered successfully", { userId: newUser._id, email });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    await Log.createLog("error", "User registration error", { error: error.message }, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// **User Login**
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      await Log.createLog("warn", "Login failed: User not found", { email });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Use the comparePassword method from the schema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await Log.createLog("warn", "Login failed: Incorrect password", { email });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    await Log.createLog("info", "User logged in", { userId: user._id, email });

    res.status(200).json({ message: "Login successful", token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    await Log.createLog("error", "User login error", { error: error.message }, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// **Get User Details**
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      await Log.createLog("warn", "User profile not found", { userId: req.user._id });
      return res.status(404).json({ message: "User not found" });
    }

    await Log.createLog("info", "User profile retrieved", { userId: user._id });

    res.status(200).json(user);
  } catch (error) {
    await Log.createLog("error", "Error fetching user profile", { error: error.message }, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// **Update User Details**
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    await Log.createLog("info", "User profile updated", { userId: req.user._id });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    await Log.createLog("error", "Error updating user profile", { error: error.message }, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// **Delete User Account**
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    await Log.createLog("info", "User account deleted", { userId: req.user._id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    await Log.createLog("error", "Error deleting user account", { error: error.message }, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
