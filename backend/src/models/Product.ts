import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name:         string;
  price:        number;
  mrp:          number;
  rating:       number;
  reviewsCount: number;
  category:     string;
  badge?:       string;
  image:        string;
  images:       string[];
  description:  string;
  bullets:      string[];
  brand:        string;
  variant?:     string;
  sku:          string;
  stock:        number;
  maxStock:     number;
  status:       string;
  petTypes:     string[];
  featured:     boolean;
  active:       boolean;
  tags:         string[];
  createdAt:    Date;
  updatedAt:    Date;
}

const productSchema = new Schema<IProduct>(
  {
    name:         { type: String, required: true, trim: true },
    price:        { type: Number, required: true, min: 0 },
    mrp:          { type: Number, required: true, min: 0 },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    category:     { type: String, required: true, index: true },
    badge:        { type: String },
    image:        { type: String, default: "" },
    images:       [{ type: String }],
    description:  { type: String, default: "" },
    bullets:      [{ type: String }],
    brand:        { type: String, default: "", index: true },
    variant:      { type: String },
    sku:          { type: String, required: true, unique: true },
    stock:        { type: Number, default: 0, min: 0 },
    maxStock:     { type: Number, default: 100, min: 0 },
    status:       { type: String, default: "In Stock", index: true },
    petTypes:     [{ type: String, index: true }],
    featured:     { type: Boolean, default: false, index: true },
    active:       { type: Boolean, default: true, index: true },
    tags:         [{ type: String }],
  },
  { timestamps: true }
);

// Full-text search on name + description
productSchema.index({ name: "text", description: "text", brand: "text" });
// Compound index for common list queries
productSchema.index({ category: 1, active: 1, featured: -1, createdAt: -1 });
productSchema.index({ price: 1, rating: -1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
