import mongoose, { Schema, Document } from "mongoose";

export type CouponStatus = "active" | "paused" | "scheduled" | "expired";
export type DiscountType = "percent" | "fixed" | "bogo";

export interface ICoupon extends Document {
  name:         string;
  code:         string;
  description:  string;
  discountType: DiscountType;
  value:        number;
  minOrder:     number;
  usageCount:   number;
  usageLimit:   number;
  startDate:    Date;
  endDate:      Date;
  status:       CouponStatus;
  revenue:      number;
  createdAt:    Date;
  updatedAt:    Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    name:         { type: String, required: true, trim: true },
    code:         { type: String, required: true, unique: true, uppercase: true, index: true },
    description:  { type: String, default: "" },
    discountType: { type: String, enum: ["percent", "fixed", "bogo"], required: true },
    value:        { type: Number, required: true, min: 0 },
    minOrder:     { type: Number, default: 0, min: 0 },
    usageCount:   { type: Number, default: 0, min: 0 },
    usageLimit:   { type: Number, default: 0 },
    startDate:    { type: Date, required: true },
    endDate:      { type: Date, required: true },
    status:       { type: String, enum: ["active","paused","scheduled","expired"], default: "active", index: true },
    revenue:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
