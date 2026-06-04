"use client";

import useAppointmentsContainer from "./AppointmentsContainer.hook";
import AppointmentsHeader       from "./Components/AppointmentsHeader";
import AppointmentsStats        from "./Components/AppointmentsStats";
import AppointmentCard          from "./Components/AppointmentCard";
import PastAppointmentCard      from "./Components/PastAppointmentCard";

export default function AppointmentsContainer() {
  const { upcoming, past, stats } = useAppointmentsContainer();

  return (
    <div className="py-2 space-y-5">

      <AppointmentsHeader />
      <AppointmentsStats stats={stats} />

      {/* ── Upcoming ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-on-surface">Upcoming</h2>
          <div className="flex gap-1.5">
            {[
              { label: "Filter",       icon: "tune" },
              { label: "Sort by date", icon: "sort" },
            ].map(({ label, icon }) => (
              <button
                key={label}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-medium text-on-surface-variant hover:bg-outline-variant/20 transition-colors cursor-pointer border-none"
              >
                <span className="material-symbols-outlined leading-none" style={{ fontSize: 13 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((a) => <AppointmentCard key={a.id} appt={a} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl border border-dashed border-outline-variant/40">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>calendar_month</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-on-surface">No upcoming appointments</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Book a service to get started</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Past services ─────────────────────────────────────────── */}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-3">Past Services</h2>
          <div className="space-y-2.5">
            {past.map((a) => <PastAppointmentCard key={a.id} appt={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}
