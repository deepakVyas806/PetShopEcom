import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryOption {
  key:         string;
  label:       string;
  description: string;
  cost:        number;
  active:      boolean;
}

export interface ITrustItem {
  iconName: string;
  title:    string;
  sub:      string;
}

export interface ILoyaltyTier {
  name:            string;
  minPoints:       number;
  discount:        number;
  bonusMultiplier: number;
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
  trustItems:            ITrustItem[];
  loyaltyTiers:          ILoyaltyTier[];
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
    trustItems: [{
      iconName: { type: String, default: "" },
      title:    { type: String, default: "" },
      sub:      { type: String, default: "" },
    }],
    loyaltyTiers: [{
      name:            { type: String, default: "" },
      minPoints:       { type: Number, default: 0 },
      discount:        { type: Number, default: 0 },
      bonusMultiplier: { type: Number, default: 1 },
    }],
  },
  { timestamps: true }
);

export const StoreSettings = mongoose.model<IStoreSettings>("StoreSettings", storeSettingsSchema);

const DEFAULT_DELIVERY_OPTIONS: IDeliveryOption[] = [
  { key: "standard", label: "Standard Delivery", description: "3–5 business days", cost: 0,   active: true  },
  { key: "express",  label: "Express Delivery",  description: "1–2 business days",  cost: 99,  active: true  },
  { key: "same_day", label: "Same Day Delivery", description: "Order before 12 PM", cost: 199, active: false },
];

const DEFAULT_TRUST_ITEMS: ITrustItem[] = [
  { iconName: "shipping", title: "Free Delivery",  sub: "On orders above ₹499"     },
  { iconName: "shield",   title: "100% Genuine",   sub: "Vet-approved products"    },
  { iconName: "medical",  title: "Expert Support", sub: "24/7 pet care guidance"   },
  { iconName: "gift",     title: "Easy Returns",   sub: "7-day hassle-free policy" },
  { iconName: "eco",      title: "Eco-Friendly",   sub: "Sustainable packaging"    },
  { iconName: "support",  title: "Live Chat",      sub: "Talk to a pet expert now" },
];

const DEFAULT_LOYALTY_TIERS: ILoyaltyTier[] = [
  { name: "Silver",   minPoints: 0,    discount: 5,  bonusMultiplier: 1 },
  { name: "Gold",     minPoints: 500,  discount: 10, bonusMultiplier: 2 },
  { name: "Platinum", minPoints: 1500, discount: 15, bonusMultiplier: 3 },
];

export async function getOrCreateSettings(): Promise<IStoreSettings> {
  let settings = await StoreSettings.findOne().lean<IStoreSettings>();
  if (!settings) {
    const doc = await StoreSettings.create({
      deliveryOptions: DEFAULT_DELIVERY_OPTIONS,
      trustItems:      DEFAULT_TRUST_ITEMS,
      loyaltyTiers:    DEFAULT_LOYALTY_TIERS,
    });
    return doc;
  }
  // Backfill new fields on existing doc
  const updates: Partial<IStoreSettings> = {};
  if (!settings.trustItems?.length)   updates.trustItems   = DEFAULT_TRUST_ITEMS;
  if (!settings.loyaltyTiers?.length) updates.loyaltyTiers = DEFAULT_LOYALTY_TIERS;
  if (Object.keys(updates).length) {
    await StoreSettings.updateOne({ _id: settings._id }, { $set: updates });
    settings = { ...settings, ...updates } as IStoreSettings;
  }
  return settings as IStoreSettings;
}
