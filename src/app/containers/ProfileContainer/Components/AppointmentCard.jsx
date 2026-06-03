"use client";

const glassCard = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 10px 25px -5px rgba(124,58,237,0.10)",
};

// Mock appointment — replace with API data when available
const APPOINTMENT = {
  day:     "24",
  month:   "OCT",
  service: "Grooming — Full Spa",
  pet:     "Cooper",
  time:    "10:30 AM",
};

export default function AppointmentCard() {
  const apt = APPOINTMENT;

  return (
    <div className="rounded-xl p-6" style={glassCard}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-on-background">Next Appointment</h2>
        <button className="text-xs text-primary font-medium hover:underline bg-transparent border-none cursor-pointer p-0">
          Schedule New
        </button>
      </div>

      {/* Appointment row */}
      <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
        {/* Date box */}
        <div className="w-14 h-14 bg-primary/20 rounded-lg flex flex-col items-center justify-center text-primary flex-shrink-0">
          <span className="text-sm font-bold leading-none">{apt.day}</span>
          <span className="text-[9px] font-bold uppercase tracking-wide mt-0.5">{apt.month}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-on-background truncate">{apt.service}</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Pet: {apt.pet} &bull; {apt.time}
          </p>
        </div>

        <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0" style={{ fontSize: 20 }}>
          chevron_right
        </span>
      </div>
    </div>
  );
}
