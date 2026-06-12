import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentMethod extends Document {
  userId:       mongoose.Types.ObjectId;
  type:         "card" | "paypal" | "wallet";
  label?:       string;
  // card fields
  network?:     string;
  last4?:       string;
  holder?:      string;
  expiry?:      string;
  // paypal fields
  paypalEmail?: string;
  isDefault:    boolean;
  createdAt:    Date;
  updatedAt:    Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type:         { type: String, enum: ["card", "paypal", "wallet"], required: true },
    label:        { type: String },
    network:      { type: String },
    last4:        { type: String },
    holder:       { type: String },
    expiry:       { type: String },
    paypalEmail:  { type: String },
    isDefault:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PaymentMethod = mongoose.model<IPaymentMethod>("PaymentMethod", paymentMethodSchema);
