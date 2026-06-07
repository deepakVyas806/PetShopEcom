"use client";
import { memo, useState, useCallback } from "react";
import {
  IconGroom, IconVet, IconTraining, IconPaw, IconMedical,
  IconClock, IconUser, IconCalendarCheck,
  IconChevronDown, IconChevronUp,
} from "@/lib/icons";

const MONTH_NAMES = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

const SERVICE_ICONS = {
  groom:    IconGroom,
  vet:      IconVet,
  training: IconTraining,
  paw:      IconPaw,
  medical:  IconMedical,
};

function endTime(time, dur) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + dur;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const AppointmentCard = memo(function AppointmentCard({ apt }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const ServiceIcon = SERVICE_ICONS[apt.serviceIcon] || IconPaw;
  const { statusMeta } = apt;

  return (
    <div className="rounded-xl border border-outline-variant/25 overflow-hidden bg-surface-container-lowest">
      <button
        onClick={toggle}
        className="w-full text-left cursor-pointer bg-transparent border-none flex items-stretch gap-0"
      >
        {/* Color stripe */}
        <div className={`w-1 shrink-0 ${statusMeta.stripe}`} />

        <div className="flex-1 px-3 py-2.5 flex items-start gap-2.5">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-brand-secondary/15 flex items-center justify-center text-[10px] font-black text-primary shrink-0 mt-0.5">
            {apt.initials}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-on-surface truncate">{apt.customer}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0 ${statusMeta.bg} ${statusMeta.text}`}>
                {statusMeta.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                <ServiceIcon size={10} weight="regular" />
                {apt.service}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {apt.petType === "Cat" ? "🐱" : "🐶"} {apt.pet}
              </span>
              <span className="text-[10px] font-bold text-primary ml-auto">{apt.amount}</span>
            </div>
          </div>

          {/* Chevron */}
          <div className="text-on-surface-variant/50 shrink-0 mt-1">
            {open ? <IconChevronUp size={11} /> : <IconChevronDown size={11} />}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="ml-1 border-t border-outline-variant/15 px-3 py-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
          {[
            { label: "Duration",      value: `${apt.dur} mins  (ends ${endTime(apt.time, apt.dur)})` },
            { label: "Groomer / Vet", value: apt.groomer },
            { label: "Pet Name",      value: apt.pet },
            { label: "Booking ID",    value: apt.id },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant/60">{label}</p>
              <p className="text-[10px] font-semibold text-on-surface mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default memo(function DaySchedule({ appointments, selectedDay, viewMonth, viewYear }) {
  if (!selectedDay) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl h-full min-h-[420px] flex flex-col items-center justify-center gap-2 text-center p-6">
        <IconCalendarCheck size={36} weight="duotone" className="text-primary/30" />
        <p className="text-xs font-semibold text-on-surface-variant">Pick a day on the calendar</p>
        <p className="text-[10px] text-on-surface-variant/60">Appointments for that day will appear here</p>
      </div>
    );
  }

  const dayRange = appointments.length > 0
    ? `${appointments[0].time} – ${endTime(appointments[appointments.length - 1].time, appointments[appointments.length - 1].dur)}`
    : null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl flex flex-col min-h-[420px]">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-black text-on-surface">
            {MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear}
          </p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        {dayRange && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30">
            <IconClock size={11} className="text-on-surface-variant" />
            <span className="text-[10px] font-semibold text-on-surface-variant">{dayRange}</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-2">
            <IconCalendarCheck size={28} weight="duotone" className="text-on-surface-variant/25" />
            <p className="text-xs text-on-surface-variant/60">No appointments on this day</p>
          </div>
        ) : (
          appointments.map((apt, idx) => (
            <div key={apt.id} className="flex gap-3">
              {/* Time column */}
              <div className="flex flex-col items-end w-11 shrink-0 pt-2.5">
                <span className="text-[10px] font-bold text-on-surface-variant leading-none">{apt.time}</span>
                {idx < appointments.length - 1 && (
                  <div className="flex-1 w-px bg-outline-variant/30 mt-1.5 mb-1 self-center" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 min-w-0 pb-3">
                <AppointmentCard apt={apt} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
