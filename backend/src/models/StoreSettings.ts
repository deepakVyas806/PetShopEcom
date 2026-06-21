import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryOption {
  key:         string;
  label:       string;
  description: string;
  cost:        number;
  active:      boolean;
}

export interface IStoreSettings extends Document {
  taxRate:               number;
  freeShippingThreshold: number;
  baseShippingCost:      number;
  deliveryOptions:       IDeliveryOption[];
  couponMinOrder:        number;
  couponMaxDiscount:     number;
  storeName:             string;
  storeEmail:            string;
  storePhone:            string;
}

const storeSettingsSchema = new Schema<IStoreSettings>(
  {
    taxRate:               { type: Number, default: 18 },
    freeShippingThreshold: { type: Number, default: 999 },
    baseShippingCost:      { type: Number, default: 50 },
    deliveryOptions: [{
      key:         { type: String, default: "" },
      label:       { type: String, default: "" },
      description: { type: String, default: "" },
      cost:        { type: Number, default: 0 },
      active:      { type: Boolean, default: true },
    }],
    couponMinOrder:    { type: Number, default: 0 },
    couponMaxDiscount: { type: Number, default: 500 },
    storeName:         { type: String, default: "artPet Shop" },
    storeEmail:        { type: String, default: "" },
    storePhone:        { type: String, default: "" },
  },
  { timestamps: true }
);

export const StoreSettings = mongoose.model<IStoreSettings>("StoreSettings", storeSettingsSchema);

const DEFAULT_DELIVERY_OPTIONS: IDeliveryOption[] = [
  { key: "standard", label: "Standard Delivery", description: "3–5 business days", cost: 0,   active: true  },
  { key: "express",  label: "Express Delivery",  description: "1–2 business days",  cost: 99,  active: true  },
  { key: "same_day", label: "Same Day Delivery", description: "Order before 12 PM", cost: 199, active: false },
];

export async function getOrCreateSettings(): Promise<IStoreSettings> {
  let settings = await StoreSettings.findOne().lean<IStoreSettings>();
  if (!settings) {
    const doc = await StoreSettings.create({ deliveryOptions: DEFAULT_DELIVERY_OPTIONS });
    return doc;
  }
  return settings as IStoreSettings;
}
