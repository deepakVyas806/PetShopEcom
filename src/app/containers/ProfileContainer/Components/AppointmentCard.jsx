"use client";

import Link from "next/link";

const GLASS = "bg-white/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl shadow-sm";

const APPOINTMENT = {
  day: "24", month: "OCT",
  service: "Grooming — Full Spa",
  pet: "Cooper",
  time: "10:30 AM",
  duration: "90 mins",
  status: "Confirmed",
};

export default function AppointmentCard() {
  const apt = APPOINTMENT;

  return (
    <div className={`${GLASS} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
          <h2 className="text-xs font-bold text-on-surface">Next Appointment</h2>
        </div>
        <Link href="/services/book" className="text-[10px] text-primary font-semibold hover:underline">Book New</Link>
      </div>

      {/* Appointment row */}
      <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
        {/* Date box */}
        <div className="w-12 h-12 bg-primary/15 rounded-lg flex flex-col items-center justify-center text-primary flex-shrink-0">
          <span className="text-sm font-black leading-none">{apt.day}</span>
          <span className="text-[8px] font-bold uppercase tracking-wide mt-0.5">{apt.month}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-on-surface truncate">{apt.service}</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            {apt.pet} · {apt.time} · {apt.duration}
          </p>
        </div>

        {/* Status + arrow */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{apt.status}</span>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-1.5 bg-primary/5 border border-primary/20 rounded-lg text-[10px] font-semibold text-primary flex items-center justify-center gap-1 hover:bg-primary/10 transition-all cursor-pointer outline-none border-0">
          <span className="material-symbols-outlined text-xs">edit_calendar</span>
          Reschedule
        </button>
        <button className="flex-1 py-1.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-[10px] font-semibold text-error/70 flex items-center justify-center gap-1 hover:bg-error/5 transition-all cursor-pointer outline-none border-0">
          <span className="material-symbols-outlined text-xs">cancel</span>
          Cancel
        </button>
      </div>
    </div>
  );
}
