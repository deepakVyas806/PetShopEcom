import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name:               string;
  email:              string;
  password:           string;
  mobile?:            string;
  petPrefs?:          string[];
  role:               "customer" | "admin";
  avatar?:            string;
  resetToken?:        string;
  resetTokenExpiry?:  Date;
  createdAt:          Date;
  updatedAt:          Date;
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    mobile:   { type: String, trim: true },
    petPrefs: [{ type: String }],
    role:              { type: String, enum: ["customer", "admin"], default: "customer", index: true },
    avatar:            { type: String },
    resetToken:        { type: String, select: false },
    resetTokenExpiry:  { type: Date,   select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// Never return password in JSON
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    delete r.password;
    delete r.resetToken;
    delete r.resetTokenExpiry;
    return r;
  },
});

export const User: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);
