"use client";

const glass = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 4px 20px -4px rgba(124,58,237,0.07)",
};

export default function AppointmentCard({ appt }) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      style={glass}
    >
      {/* Pet avatar with circular service badge */}
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={appt.petImage}
          alt={appt.petName}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
        />
        {/* Circular service badge */}
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest ${appt.serviceIconBg}`}
        >
          <span
            className={`material-symbols-outlined leading-none ${appt.serviceIconClr}`}
            style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}
          >
            {appt.serviceIcon}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-on-surface">{appt.petName}</span>
          <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full leading-none">
            Upcoming
          </span>
        </div>
        <p className="text-xs text-on-surface-variant truncate mb-1.5">{appt.service}</p>
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="w-4 h-4 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 10 }}>calendar_month</span>
            </span>
            {appt.date}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="w-4 h-4 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 10 }}>schedule</span>
            </span>
            {appt.time}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button className="px-3 py-1.5 border border-primary/40 text-primary rounded-full text-xs font-semibold hover:bg-primary/5 transition-all cursor-pointer bg-transparent">
          Reschedule
        </button>
        <button className="px-3 py-1.5 bg-primary text-on-primary rounded-full text-xs font-semibold hover:shadow-md hover:brightness-105 transition-all cursor-pointer border-none">
          Details
        </button>
      </div>
    </div>
  );
}
