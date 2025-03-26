import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, default: "in" },
});

const itemSchema = new mongoose.Schema({
  productId: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 9),
  },
  productType: { type: String, enum: ["shirt", "sharara"], required: true },
  colour: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  measurements: {
    shirtMeasurements: {
      shirtLength: measurementSchema,
      dartPoint: measurementSchema,
      upperBust: measurementSchema,
      bust: measurementSchema,
      waist: measurementSchema,
      hips: measurementSchema,
      frontNeck: measurementSchema,
      backNeck: measurementSchema,
      tira: measurementSchema,
      sleevesLength: measurementSchema,
      moriSleeveless: measurementSchema,
      biceps: measurementSchema,
      armhole: measurementSchema,
    },
    shararaMeasurements: {
      shararaLength: measurementSchema,
      shararaWaist: measurementSchema,
      hips: measurementSchema,
      thigh: measurementSchema,
    },
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingId: { type: String, unique: true }, // Use UUID for unique tracking ID
    dnNumber: { type: String },
    deliveryDate: { type: Date },
    items: [itemSchema],
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

// Prevent model recompilation in Next.js & Vercel
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
