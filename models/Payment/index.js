const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["card", "paypal", "netbanking", "wallet", "cod"], required: true },
        paymentStatus: { type: String, enum: ["successful", "failed", "refunded"], default: "pending" },
        transactionId: { type: String, unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
