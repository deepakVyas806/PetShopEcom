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

export interface IOrder extends Document {
  orderId:         string;
  userId:          mongoose.Types.ObjectId;
  items:           OrderItemSnapshot[];
  subtotal:        number;
  tax:             number;
  shipping:        number;
  discount:        number;
  total:           number;
  shippingAddress: ShippingAddress;
  paymentMethod:   string;
  couponCode?:     string;
  status:          OrderStatus;
  createdAt:       Date;
  updatedAt:       Date;
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
    couponCode:    { type: String },
    status:        {
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
