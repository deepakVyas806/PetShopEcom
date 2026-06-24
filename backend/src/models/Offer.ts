import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  headline:          string;
  subtitle:          string;
  badge:             string;
  emoji:             string;
  gradientFrom:      string;
  gradientTo:        string;
  ctaLabel:          string;
  ctaHref:           string;
  showOnLandingPage: boolean;
  active:            boolean;
  order:             number;
}

const offerSchema = new Schema<IOffer>(
  {
    headline:          { type: String, required: true, trim: true },
    subtitle:          { type: String, default: "" },
    badge:             { type: String, default: "" },
    emoji:             { type: String, default: "🎁" },
    gradientFrom:      { type: String, default: "#f97316" },
    gradientTo:        { type: String, default: "#ef4444" },
    ctaLabel:          { type: String, default: "Shop Now" },
    ctaHref:           { type: String, default: "/marketplace" },
    showOnLandingPage: { type: Boolean, default: true },
    active:            { type: Boolean, default: true, index: true },
    order:             { type: Number, default: 0 },
  },
  { timestamps: true }
);

offerSchema.index({ active: 1, showOnLandingPage: 1, order: 1 });

export const Offer = mongoose.model<IOffer>("Offer", offerSchema);
