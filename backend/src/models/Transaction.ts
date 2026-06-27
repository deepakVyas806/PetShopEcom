import mongoose, { Schema, Document, Types } from "mongoose";

export type TxnStatus = "success" | "pending" | "failed" | "refunded";

export interface ITransaction extends Document {
  transactionId:      string;
  orderId:            Types.ObjectId;
  orderRef:           string;        // human-readable order ID (e.g. PET-123456)
  userId:             Types.ObjectId;
  amount:             number;
  currency:           string;
  status:             TxnStatus;
  method:             string;        // cod | card | upi | netbanking | wallet | razorpay
  razorpayOrderId?:   string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  cardLast4?:         string;
  cardBrand?:         string;
  cardNetwork?:       string;
  upiVpa?:            string;
  upiApp?:            string;
  bankName?:          string;
  walletName?:        string;
  notes?:             string;
  createdAt:          Date;
  updatedAt:          Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId:     { type: String, required: true, unique: true, index: true },
    orderId:           { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderRef:          { type: String, default: "" },
    userId:            { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount:            { type: Number, required: true, min: 0 },
    currency:          { type: String, default: "INR" },
    status:            { type: String, required: true, enum: ["success","pending","failed","refunded"], index: true },
    method:            { type: String, required: true, index: true },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    cardLast4:         { type: String },
    cardBrand:         { type: String },
    cardNetwork:       { type: String },
    upiVpa:            { type: String },
    upiApp:            { type: String },
    bankName:          { type: String },
    walletName:        { type: String },
    notes:             { type: String },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ method: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
