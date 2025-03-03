const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["super_admin", "business_owner", "store_manager", "customer", "delivery_agent", "support_agent", "vendor"],
      required: true,
    },
    address: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

// **Hash password before saving the user**
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is unchanged
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// **Method to compare passwords**
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// **Generate JWT Token**
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("User", UserSchema);