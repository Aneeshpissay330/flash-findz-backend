const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "assigned", "picked", "in_transit", "delivered", "failed"], default: "pending" },
        estimatedDelivery: Date,
        actualDelivery: Date,
        trackingId: { type: String, unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
