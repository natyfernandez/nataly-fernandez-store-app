import { Schema, model } from "mongoose";
import crypto from "crypto";

const ticketSchema = new Schema({
  code: { type: String, unique: true, default: () => crypto.randomBytes(12).toString("hex") },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true }
  }],
  status: {
    type: String,
    required: true,
    enum: ["pending", "cancelled", "completed"],
    default: "pending",
  },
});

// Middleware de mongoose
ticketSchema.pre("find", function () {
  this.populate("products");
});

ticketSchema.pre("findOne", function () {
  this.populate("products");
});

export const ticketModel = model("ticket", ticketSchema);
