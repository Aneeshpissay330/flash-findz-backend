const ReviewSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        review: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
