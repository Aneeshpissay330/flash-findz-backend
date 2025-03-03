const TicketSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        issue: { type: String, required: true },
        status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
