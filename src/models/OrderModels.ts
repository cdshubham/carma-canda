import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  size: { type: String },
  productId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models?.orders || mongoose.model("orders", orderSchema);

export default Order;
