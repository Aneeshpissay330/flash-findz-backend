const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
    {
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        businessName: { type: String, required: true },
        businessType: { type: String, enum: ["retail", "wholesale", "dropshipping", "services"], required: true },
        description: String,
        logo: String,
        businessAddress: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
