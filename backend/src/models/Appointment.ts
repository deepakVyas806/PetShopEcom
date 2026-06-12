import mongoose, { Schema, Document } from "mongoose";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface IAppointment extends Document {
  appointmentId: string;
  userId:        mongoose.Types.ObjectId;
  serviceId:     mongoose.Types.ObjectId;
  serviceName:   string;
  serviceIcon?:  string;
  date:          string;
  timeSlot:      string;
  petName:       string;
  petType?:      string;
  groomer?:      string;
  amount:        number;
  status:        AppointmentStatus;
  notes?:        string;
  createdAt:     Date;
  updatedAt:     Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true, index: true },
    userId:        { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceId:     { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName:   { type: String, required: true },
    serviceIcon:   { type: String },
    date:          { type: String, required: true, index: true },
    timeSlot:      { type: String, required: true },
    petName:       { type: String, required: true },
    petType:       { type: String },
    groomer:       { type: String },
    amount:        { type: Number, required: true },
    status:        {
      type:    String,
      default: "Pending",
      enum:    ["Pending", "Confirmed", "Completed", "Cancelled"],
      index:   true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ date: 1, timeSlot: 1, serviceId: 1 }); // for slot availability check

export const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);
