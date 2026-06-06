"use client";

import { useState, useMemo } from "react";
import { IconCalendar, IconSearchOff } from "@/lib/icons";
import useAppointmentsContainer, { APPOINTMENTS } from "./AppointmentsContainer.hook";
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
  const { stats } = useAppointmentsContainer();

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date-asc");

  // Filter + sort all appointments
  const filtered = useMemo(() => {
    let list = statusFilter === "all"
      ? APPOINTMENTS
      : APPOINTMENTS.filter((a) => a.status === statusFilter);

    list = [...list].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortOrder === "date-asc" ? da - db : db - da;
    });

    return list;
  }, [statusFilter, sortOrder]);

  const upcoming = filtered.filter((a) => a.status === "upcoming");
  const past     = filtered.filter((a) => a.status !== "upcoming");

  return (
    <div className="py-2 space-y-5">

      <AppointmentsHeader />
      <AppointmentsStats stats={stats} />

      {/* ── Filter & Sort controls ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Segmented pill filter */}
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

        {/* Sort dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant border-none outline-none cursor-pointer hover:bg-outline-variant/20 transition-colors"
        >
          <option value="date-asc">Date: Oldest first</option>
          <option value="date-desc">Date: Newest first</option>
        </select>
      </div>

      {/* ── Upcoming ──────────────────────────────────────────────── */}
      {(statusFilter === "all" || statusFilter === "upcoming") && (
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-3">Upcoming</h2>

          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((a) => <AppointmentCard key={a.id} appt={a} />)}
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

      {/* ── Past services ─────────────────────────────────────────── */}
      {(statusFilter === "all" || statusFilter === "completed" || statusFilter === "cancelled") && past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-3">Past Services</h2>
          <div className="space-y-2.5">
            {past.map((a) => <PastAppointmentCard key={a.id} appt={a} />)}
          </div>
        </section>
      )}

      {/* Empty state when no results at all */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl border border-dashed border-outline-variant/40">
          <IconSearchOff size={28} className="text-on-surface-variant" weight="regular" />
          <p className="text-xs text-on-surface-variant font-medium">No appointments match this filter</p>
        </div>
      )}
    </div>
  );
}
