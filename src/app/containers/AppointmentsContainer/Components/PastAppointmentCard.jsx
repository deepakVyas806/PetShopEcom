"use client";

import { IconReorder, IconInfo } from "@/lib/icons";

const STATUS_CFG = {
  completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed", Icon: IconReorder },
  cancelled: { bg: "bg-error/10",  text: "text-error",     label: "Cancelled", Icon: IconInfo   },
};

export default function PastAppointmentCard({ appt }) {
  const cfg = STATUS_CFG[appt.status] ?? STATUS_CFG.completed;
  const CfgIcon = cfg.Icon;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest/70 hover:bg-surface-container-lowest transition-colors duration-200">

      {/* Circular pet avatar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={appt.petImage}
        alt={appt.petName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 grayscale-[25%] opacity-80"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-on-surface">{appt.petName}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant truncate">
          {appt.service} &bull; {appt.date}
        </p>
      </div>

      {/* Circular CTA */}
      <button
        className="w-8 h-8 rounded-full border border-primary/30 text-primary flex items-center justify-center hover:bg-primary/5 hover:border-primary/60 transition-all cursor-pointer bg-transparent flex-shrink-0"
        title={cfg.label === "Completed" ? "Rebook" : "View notes"}
      >
        <CfgIcon size={15} weight="regular" />
      </button>
    </div>
  );
}
