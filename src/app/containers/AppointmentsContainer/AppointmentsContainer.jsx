"use client";

import { useState, useMemo } from "react";
import { IconCalendar, IconSearchOff } from "@/lib/icons";
import useAppointmentsContainer from "./AppointmentsContainer.hook";
import AppointmentsHeader  from "./Components/AppointmentsHeader";
import AppointmentsStats   from "./Components/AppointmentsStats";
import AppointmentCard     from "./Components/AppointmentCard";
import PastAppointmentCard from "./Components/PastAppointmentCard";

const STATUS_FILTERS = [
  { value: "all",       label: "All"       },
  { value: "upcoming",  label: "Upcoming"  },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AppointmentsContainer() {
  const { upcoming, past, stats, loading, handleCancel } = useAppointmentsContainer();

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder,    setSortOrder]    = useState("date-asc");

  const allAppointments = useMemo(() => [...upcoming, ...past], [upcoming, past]);

  const filtered = useMemo(() => {
    let list = statusFilter === "all"
      ? allAppointments
      : allAppointments.filter((a) => a.status?.toLowerCase() === statusFilter);

    return [...list].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortOrder === "date-asc" ? da - db : db - da;
    });
  }, [allAppointments, statusFilter, sortOrder]);

  const filteredUpcoming = filtered.filter((a) => a.status?.toLowerCase() === "upcoming");
  const filteredPast     = filtered.filter((a) => a.status?.toLowerCase() !== "upcoming");

  if (loading) {
    return (
      <div className="py-2 space-y-5">
        <AppointmentsHeader />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-surface-container-low animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-5">

      <AppointmentsHeader />
      <AppointmentsStats stats={stats} />

      {/* Filter & Sort controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-surface-container-high rounded-full p-0.5 flex-wrap">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border-none ${
                statusFilter === value
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface bg-transparent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant border-none outline-none cursor-pointer hover:bg-outline-variant/20 transition-colors"
        >
          <option value="date-asc">Date: Oldest first</option>
          <option value="date-desc">Date: Newest first</option>
        </select>
      </div>

      {/* Upcoming */}
      {(statusFilter === "all" || statusFilter === "upcoming") && (
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-3">Upcoming</h2>

          {filteredUpcoming.length > 0 ? (
            <div className="space-y-3">
              {filteredUpcoming.map((a) => (
                <AppointmentCard
                  key={a._id ?? a.id}
                  appt={a}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl border border-dashed border-outline-variant/40">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <IconCalendar size={20} className="text-primary" weight="bold" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">No upcoming appointments</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Book a service to get started</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Past services */}
      {(statusFilter === "all" || statusFilter === "completed" || statusFilter === "cancelled") && filteredPast.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-3">Past Services</h2>
          <div className="space-y-2.5">
            {filteredPast.map((a) => (
              <PastAppointmentCard key={a._id ?? a.id} appt={a} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl border border-dashed border-outline-variant/40">
          <IconSearchOff size={28} className="text-on-surface-variant" weight="regular" />
          <p className="text-xs text-on-surface-variant font-medium">No appointments match this filter</p>
        </div>
      )}
    </div>
  );
}
