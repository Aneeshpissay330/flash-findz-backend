const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } = require("../../controllers/user");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

// **Public Routes**
router.post("/register", registerUser); // Register
router.post("/login", loginUser); // Login

// **Protected Routes (Require Authentication)**
router.get("/profile", authMiddleware, getUserProfile); // Get user profile
router.put("/profile", authMiddleware, updateUserProfile); // Update user profile
router.delete("/delete", authMiddleware, deleteUser); // Delete user account

module.exports = router;
