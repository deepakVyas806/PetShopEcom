import mongoose, { Schema, Document } from "mongoose";

export const CATALOG_TYPES = [
  "category", "brand", "petType", "lifeStage", "tag", "badge",
] as const;

export type CatalogType = typeof CATALOG_TYPES[number];

export interface ICatalogItem extends Document {
  type:     CatalogType;
  name:     string;
  slug:     string;
  icon:     string;
  color:    string;
  logoUrl:  string;
  imageUrl: string;
  order:    number;
  active:   boolean;
}

const catalogItemSchema = new Schema<ICatalogItem>(
  {
    type:     { type: String, required: true, enum: CATALOG_TYPES, index: true },
    name:     { type: String, required: true, trim: true },
    slug:     { type: String, required: true, trim: true },
    icon:     { type: String, default: "" },
    color:    { type: String, default: "" },
    logoUrl:  { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    order:    { type: Number, default: 0 },
    active:   { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

catalogItemSchema.index({ type: 1, order: 1, name: 1 });

export function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const CatalogItem = mongoose.model<ICatalogItem>("CatalogItem", catalogItemSchema);
