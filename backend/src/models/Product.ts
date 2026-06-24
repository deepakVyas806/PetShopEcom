import mongoose, { Schema, Document, Types } from "mongoose";

interface ProductVariant {
  name:  string;
  price: number;
  stock: number;
}

interface NutritionFacts {
  crudeProtein?: string;
  crudeFat?:     string;
  crudeFiber?:   string;
  omega3?:       string;
  omega6?:       string;
  moisture?:     string;
}

export interface IProduct extends Document {
  name:            string;
  price:           number;
  mrp:             number;
  rating:          number;
  reviewsCount:    number;
  // FK refs → CatalogItem (populated on admin fetch; string fields are derived slugs for filter compat)
  categoryId?:     Types.ObjectId;
  brandId?:        Types.ObjectId;
  petTypeIds:      Types.ObjectId[];
  lifeStageId?:    Types.ObjectId;
  // Derived string fields (slug-based) — kept for public filter API backward compat
  category:        string;
  brand:           string;
  petTypes:        string[];
  lifeStage:       string;
  badge?:          string;
  image:           string;
  images:          string[];
  description:     string;
  bullets:         string[];
  variants:        ProductVariant[];
  sku:             string;
  stock:           number;
  maxStock:        number;
  status:          string;
  weight:          string;
  dimensions:      string;
  nutritionFacts?: NutritionFacts;
  sourcing?:       string;
  urlSlug:         string;
  metaTitle:       string;
  metaDescription: string;
  featured:        boolean;
  active:          boolean;
  visibility:      string;
  tags:            string[];
  createdAt:       Date;
  updatedAt:       Date;
}

const productSchema = new Schema<IProduct>(
  {
    name:         { type: String, required: true, trim: true },
    price:        { type: Number, required: true, min: 0 },
    mrp:          { type: Number, required: true, min: 0 },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },

    // Catalog FK references
    categoryId:  { type: Schema.Types.ObjectId, ref: "CatalogItem", default: null },
    brandId:     { type: Schema.Types.ObjectId, ref: "CatalogItem", default: null },
    petTypeIds:  [{ type: Schema.Types.ObjectId, ref: "CatalogItem" }],
    lifeStageId: { type: Schema.Types.ObjectId, ref: "CatalogItem", default: null },

    // Denormalized slug strings — derived from catalog on save, used by public filter API
    category:     { type: String, default: "", index: true },
    brand:        { type: String, default: "", index: true },
    petTypes:     [{ type: String, index: true }],
    lifeStage:    { type: String, default: "" },

    badge:        { type: String, default: "" },
    image:        { type: String, default: "" },
    images:       [{ type: String }],
    description:  { type: String, default: "" },
    bullets:      [{ type: String }],
    variants: [{
      name:  { type: String, default: "" },
      price: { type: Number, default: 0 },
      stock: { type: Number, default: 0 },
    }],
    sku:             { type: String, required: true, unique: true },
    stock:           { type: Number, default: 0, min: 0 },
    maxStock:        { type: Number, default: 100, min: 0 },
    status:          { type: String, default: "In Stock", index: true },
    weight:          { type: String, default: "" },
    dimensions:      { type: String, default: "" },
    nutritionFacts: {
      crudeProtein: { type: String, default: "" },
      crudeFat:     { type: String, default: "" },
      crudeFiber:   { type: String, default: "" },
      omega3:       { type: String, default: "" },
      omega6:       { type: String, default: "" },
      moisture:     { type: String, default: "" },
    },
    sourcing: { type: String, default: "" },
    urlSlug:         { type: String, default: "" },
    metaTitle:       { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    featured:        { type: Boolean, default: false, index: true },
    active:          { type: Boolean, default: true,  index: true },
    visibility:      { type: String, default: "public", enum: ["public", "private"] },
    tags:            [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1, active: 1, featured: -1, createdAt: -1 });
productSchema.index({ price: 1, rating: -1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
