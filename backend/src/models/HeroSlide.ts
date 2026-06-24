import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide extends Document {
  badge:        string;
  badgeEmoji:   string;
  headline:     string;
  subtitle:     string;
  imageUrl:     string;
  overlay:      string;
  contentSide:  string;
  ctaLabel:     string;
  ctaHref:      string;
  cta2Label:    string;
  cta2Href:     string;
  active:       boolean;
  order:        number;
}

const heroSlideSchema = new Schema<IHeroSlide>(
  {
    badge:        { type: String, default: "" },
    badgeEmoji:   { type: String, default: "🐾" },
    headline:     { type: String, required: true, trim: true },
    subtitle:     { type: String, default: "" },
    imageUrl:     { type: String, default: "" },
    overlay:      { type: String, default: "linear-gradient(to right, rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)" },
    contentSide:  { type: String, enum: ["left", "right"], default: "left" },
    ctaLabel:     { type: String, default: "Shop Now" },
    ctaHref:      { type: String, default: "/marketplace" },
    cta2Label:    { type: String, default: "" },
    cta2Href:     { type: String, default: "" },
    active:       { type: Boolean, default: true, index: true },
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

heroSlideSchema.index({ active: 1, order: 1 });

export const HeroSlide = mongoose.model<IHeroSlide>("HeroSlide", heroSlideSchema);
