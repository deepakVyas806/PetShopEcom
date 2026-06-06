"use client";

import Link from "next/link";
import { Card, Badge, Button, SectionHeader } from "@/components/ui";
import { IconCalendar, IconEdit, IconCancel, IconChevronRight } from "@/lib/icons";

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
    <Card>
      {/* Header */}
      <SectionHeader
        title="Next Appointment"
        icon={<IconCalendar size={16} weight="regular" />}
        action={<Link href="/services/book" className="text-[10px] text-primary font-semibold hover:underline">Book New</Link>}
        className="mb-3"
      />

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
          <Badge variant="success">{apt.status}</Badge>
          <IconChevronRight size={14} className="text-on-surface-variant" weight="bold" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mt-3">
        <Button variant="ghost" size="sm" className="flex-1 py-1.5">
          <IconEdit size={12} weight="bold" />
          Reschedule
        </Button>
        <Button variant="danger" size="sm" className="flex-1 py-1.5">
          <IconCancel size={12} weight="bold" />
          Cancel
        </Button>
      </div>
    </Card>
  );
}
