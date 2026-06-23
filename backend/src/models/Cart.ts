import mongoose, { Schema, Document } from "mongoose";

interface CartItemDoc {
  productId: mongoose.Types.ObjectId;
  quantity:  number;
  addedAt:   Date;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items:  CartItemDoc[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity:  { type: Number, required: true, min: 1, default: 1 },
        addedAt:   { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
