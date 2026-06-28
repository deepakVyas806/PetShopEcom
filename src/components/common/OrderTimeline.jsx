"use client";

import { IconCheckCircle, IconPackage, IconShipping, IconNavigate, IconHome } from "@/lib/icons";

const STEPS = [
  { label: "Ordered",          Icon: IconCheckCircle },
  { label: "Processing",       Icon: IconPackage     },
  { label: "Shipped",          Icon: IconShipping    },
  { label: "Out for Delivery", Icon: IconNavigate    },
  { label: "Delivered",        Icon: IconHome        },
];

const STATUS_TO_STEP = {
  "Pending":          0,
  "Confirmed":        0,
  "Processing":       1,
  "Shipped":          2,
  "Out for Delivery": 3,
  "Delivered":        4,
  "Cancelled":        -1,
  "Refunded":         -1,
};

export default function OrderTimeline({ status, createdAt, className = "" }) {
  const doneUpTo    = STATUS_TO_STEP[status] ?? 0;
  const isCancelled = doneUpTo === -1;
  const progressPct = isCancelled ? 0 : (doneUpTo / (STEPS.length - 1)) * 100;

  const orderedNote = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-card-sm ${className}`}>
      <h3 className="text-xs font-bold text-on-surface mb-5 flex items-center gap-2">
        <IconShipping size={15} className="text-primary" weight="regular" />
        Delivery Progress
      </h3>

      {/* ── Desktop: horizontal ── */}
      <div className="hidden sm:block relative mb-2">
        {/* Track line */}
        <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-surface-container-high z-0">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="relative z-10 flex justify-between">
          {STEPS.map(({ label, Icon }, i) => {
            const isDone   = !isCancelled && i <= doneUpTo;
            const isActive = !isCancelled && i === doneUpTo;
            return (
              <div key={label} className="flex flex-col items-center gap-1.5 w-1/5">
                <div className={[
                  "w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-background shadow-sm transition-all duration-300",
                  isDone  ? "bg-primary text-on-primary"                              : "bg-surface-container-high text-on-surface-variant",
                  isActive ? "scale-110 shadow-[0_0_0_4px_rgba(99,14,212,0.15)]"     : "",
                ].join(" ")}>
                  <Icon size={15} weight={isDone ? "fill" : "regular"} />
                </div>
                <p className={`text-[10px] font-semibold text-center leading-tight ${isDone ? "text-primary" : "text-on-surface-variant"}`}>
                  {label}
                </p>
                {i === 0 && orderedNote && (
                  <p className="text-[9px] text-on-surface-variant text-center leading-tight">{orderedNote}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: vertical ── */}
      <div className="sm:hidden space-y-0">
        {STEPS.map(({ label, Icon }, i) => {
          const isDone   = !isCancelled && i <= doneUpTo;
          const isActive = !isCancelled && i === doneUpTo;
          return (
            <div key={label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={[
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all",
                  isDone ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant",
                ].join(" ")}>
                  <Icon size={13} weight={isDone ? "fill" : "regular"} />
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[28px] transition-colors ${isDone ? "bg-primary/40" : "bg-surface-container-high"}`} />
                )}
              </div>
              <div className="pb-4 pt-1">
                <p className={`text-xs font-semibold leading-tight ${
                  isActive ? "text-primary" : isDone ? "text-on-surface" : "text-on-surface-variant"
                }`}>
                  {label}
                </p>
                {i === 0 && orderedNote && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{orderedNote}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <p className="text-xs text-error font-semibold text-center mt-3 py-2 bg-error/5 rounded-lg border border-error/15">
          This order has been {status?.toLowerCase()}.
        </p>
      )}
    </div>
  );
}
