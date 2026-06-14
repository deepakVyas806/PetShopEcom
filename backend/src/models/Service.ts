import mongoose, { Schema, Document } from "mongoose";

interface OperatingHour {
  day:   string;
  start: string;
  end:   string;
}

export interface IService extends Document {
  name:           string;
  title:          string;
  subtitle?:      string;
  category:       string;
  badge?:         string;
  rating:         number;
  reviewCount:    number;
  duration:       string;
  price:          number;
  description:    string;
  image:          string;
  images:         string[];
  petTypes:       string[];
  includes?:      string;
  specialist?:    string;
  capacity:       number;
  availability:   string;
  featured:       boolean;
  active:         boolean;
  visibility:     string;
  tags:           string[];
  operatingHours: OperatingHour[];
  targetPets:     string;
  createdAt:      Date;
  updatedAt:      Date;
}

const serviceSchema = new Schema<IService>(
  {
    name:        { type: String, required: true, trim: true },
    title:       { type: String, required: false, default: "", trim: true },
    subtitle:    { type: String },
    category:    { type: String, required: true, index: true },
    badge:       { type: String },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    duration:    { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },
    images:      [{ type: String }],
    petTypes:    [{ type: String }],
    includes:    { type: String },
    specialist:  { type: String },
    capacity:    { type: Number, default: 10 },
    availability: { type: String, default: "instant", enum: ["instant", "waitlist", "unavailable"] },
    featured:    { type: Boolean, default: false, index: true },
    active:      { type: Boolean, default: true, index: true },
    visibility:  { type: String, default: "public", enum: ["public", "private"] },
    tags:        [{ type: String }],
    operatingHours: [{
      day:   { type: String },
      start: { type: String },
      end:   { type: String },
    }],
    targetPets: { type: String, default: "" },
  },
  { timestamps: true }
);

serviceSchema.index({ name: "text", description: "text" });
serviceSchema.index({ category: 1, active: 1, featured: -1 });

export const Service = mongoose.model<IService>("Service", serviceSchema);
