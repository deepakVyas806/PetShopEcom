import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId:    mongoose.Types.ObjectId;
  userId:       mongoose.Types.ObjectId;
  name:         string;
  rating:       number;
  verified:     boolean;
  title:        string;
  body:         string;
  photos:       string[];
  helpfulCount: number;
  helpfulVotes: mongoose.Types.ObjectId[];
  createdAt:    Date;
  updatedAt:    Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId:    { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    userId:       { type: Schema.Types.ObjectId, ref: "User", required: true },
    name:         { type: String, required: true },
    rating:       { type: Number, required: true, min: 1, max: 5, index: true },
    verified:     { type: Boolean, default: false },
    title:        { type: String, required: true, trim: true },
    body:         { type: String, required: true, trim: true },
    photos:       [{ type: String }],
    helpfulCount: { type: Number, default: 0 },
    helpfulVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, rating: -1 });
// One review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
