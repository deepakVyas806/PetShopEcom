import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  userId:    mongoose.Types.ObjectId;
  name:      string;
  type:      string;
  label?:    string;
  icon?:     string;
  line1:     string;
  line2?:    string;
  city:      string;
  state:     string;
  country:   string;
  pincode:   string;
  phone:     string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:      { type: String, required: true, trim: true },
    type:      { type: String, default: "Home" },
    label:     { type: String },
    icon:      { type: String },
    line1:     { type: String, required: true },
    line2:     { type: String },
    city:      { type: String, required: true },
    state:     { type: String, required: true },
    country:   { type: String, default: "India" },
    pincode:   { type: String, required: true },
    phone:     { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddress>("Address", addressSchema);
