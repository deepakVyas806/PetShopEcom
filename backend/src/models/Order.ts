import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "Pending" | "Confirmed" | "Processing"
  | "Shipped" | "Out for Delivery" | "Delivered"
  | "Cancelled" | "Refunded";

interface OrderItemSnapshot {
  productId: mongoose.Types.ObjectId;
  name:      string;
  image:     string;
  price:     number;
  quantity:  number;
  sku:       string;
}

interface ShippingAddress {
  name:     string;
  line1:    string;
  line2?:   string;
  city:     string;
  state:    string;
  country:  string;
  pincode:  string;
  phone:    string;
}

// Structured payment details — captured at order creation time.
// Razorpay fields are populated for all online payments.
// Method-specific sub-fields (card*, upi*, bank*, wallet*) are populated
// when that instrument is used; they can also be enriched later via webhook.
export interface PaymentDetails {
  method: string; // "cod" | "card" | "upi" | "netbanking" | "wallet" | "emi"

  // Razorpay — present for every online payment
  razorpayOrderId?:   string;
  razorpayPaymentId?: string;
  razorpaySignature?: string; // stored for audit trail

  // Card
  cardLast4?:   string; // e.g. "4242"
  cardBrand?:   string; // Visa | Mastercard | RuPay | AmEx
  cardNetwork?: string; // Visa | Mastercard | RuPay
  cardIssuer?:  string; // HDFC | ICICI | SBI | Axis
  cardType?:    string; // "credit" | "debit"

  // UPI
  upiVpa?: string; // e.g. "user@paytm" (can be masked)
  upiApp?: string; // GPay | PhonePe | BHIM | Paytm

  // Net banking
  bankName?: string; // State Bank of India
  bankCode?: string; // SBIN

  // Wallet
  walletName?: string; // Paytm | Mobikwik | Freecharge

  // Cash on delivery
  codNote?: string; // e.g. "Collect ₹799 on delivery"
}

export interface IOrder extends Document {
  orderId:            string;
  userId:             mongoose.Types.ObjectId;
  items:              OrderItemSnapshot[];
  subtotal:           number;
  tax:                number;
  shipping:           number;
  discount:           number;
  total:              number;
  shippingAddress:    ShippingAddress;
  paymentMethod:      string;
  paymentDetails:     PaymentDetails;
  couponCode?:        string;
  status:             OrderStatus;
  // Top-level Razorpay fields kept for backward-compat with existing orders
  razorpayOrderId?:   string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt:          Date;
  updatedAt:          Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId:  { type: String, required: true, unique: true, index: true },
    userId:   { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name:      { type: String, required: true },
      image:     { type: String, default: "" },
      price:     { type: Number, required: true },
      quantity:  { type: Number, required: true, min: 1 },
      sku:       { type: String, default: "" },
    }],
    subtotal:      { type: Number, required: true },
    tax:           { type: Number, required: true },
    shipping:      { type: Number, required: true },
    discount:      { type: Number, default: 0 },
    total:         { type: Number, required: true },
    shippingAddress: {
      name:    { type: String, required: true },
      line1:   { type: String, required: true },
      line2:   { type: String },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      country: { type: String, default: "India" },
      pincode: { type: String, required: true },
      phone:   { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },

    // Structured per-method payment details
    paymentDetails: {
      method:             { type: String, required: true },
      // Razorpay
      razorpayOrderId:    { type: String },
      razorpayPaymentId:  { type: String },
      razorpaySignature:  { type: String },
      // Card
      cardLast4:          { type: String },
      cardBrand:          { type: String },
      cardNetwork:        { type: String },
      cardIssuer:         { type: String },
      cardType:           { type: String },
      // UPI
      upiVpa:             { type: String },
      upiApp:             { type: String },
      // Net banking
      bankName:           { type: String },
      bankCode:           { type: String },
      // Wallet
      walletName:         { type: String },
      // COD
      codNote:            { type: String },
    },

    couponCode:         { type: String },
    // Top-level Razorpay fields — kept for backward-compat
    razorpayOrderId:    { type: String },
    razorpayPaymentId:  { type: String },
    razorpaySignature:  { type: String },
    status:             {
      type:    String,
      default: "Pending",
      enum:    ["Pending","Confirmed","Processing","Shipped","Out for Delivery","Delivered","Cancelled","Refunded"],
      index:   true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
