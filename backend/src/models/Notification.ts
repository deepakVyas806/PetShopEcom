import mongoose, { Schema, Document } from "mongoose";

interface NotificationAction {
  label:   string;
  variant: "primary" | "secondary";
  href:    string;
}

export interface INotification extends Document {
  userId:      mongoose.Types.ObjectId;
  type:        "order" | "promo" | "account" | "service";
  icon:        string;
  iconBg:      string;
  iconColor:   string;
  title:       string;
  body:        string;
  highlight?:  string;
  read:        boolean;
  actions:     NotificationAction[];
  createdAt:   Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type:      { type: String, enum: ["order", "promo", "account", "service"], required: true, index: true },
    icon:      { type: String, required: true },
    iconBg:    { type: String, default: "bg-primary/10" },
    iconColor: { type: String, default: "text-primary" },
    title:     { type: String, required: true },
    body:      { type: String, required: true },
    highlight: { type: String },
    read:      { type: Boolean, default: false, index: true },
    actions: [{
      label:   { type: String },
      variant: { type: String, enum: ["primary", "secondary"] },
      href:    { type: String },
    }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
