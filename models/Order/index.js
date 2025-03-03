const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"], default: "pending" },
        paymentStatus: { type: String, enum: ["paid", "pending", "failed", "refunded"], default: "pending" },
        trackingId: String,
        deliveryAddress: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
