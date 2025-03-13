import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 9),
  },
  productType: { type: String, enum: ["shirt", "sharara"], required: true },
  size: { type: String, required: true },
  colour: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  measurements: {
    shirtMeasurements: {
      shirtLength: { type: Number },
      dartPoint: { type: Number },
      upperBust: { type: Number },
      bust: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      frontNeck: { type: Number },
      backNeck: { type: Number },
      tira: { type: Number },
      sleevesLength: { type: Number },
      moriSleeveless: { type: Number },
      biceps: { type: Number },
      armhole: { type: Number },
    },
    shararaMeasurements: {
      shararaLength: { type: Number },
      shararaWaist: { type: Number },
      hips: { type: Number },
      thigh: { type: Number },
    },
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  trackingId: { type: String, unique: true, required: true },
  dnNumber: { type: String },
  deliveryDate: { type: Date },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models?.orders || mongoose.model("orders", orderSchema);

export default Order;
