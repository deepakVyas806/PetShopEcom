"use client";

import { IconChart, IconCheck, IconShipping, IconNavigate, IconPackage } from "@/lib/icons";

const MILESTONE_ICON_MAP = {
  check:         IconCheck,
  local_shipping:IconShipping,
  near_me:       IconNavigate,
  inventory_2:   IconPackage,
};

const CIRCLE = {
  done:    "bg-primary-container text-on-primary-container w-8 h-8",
  active:  "bg-primary text-on-primary w-9 h-9 ring-4 ring-primary/20 shadow-md",
  pending: "bg-surface-container-high text-on-surface-variant w-8 h-8",
};

export default function DeliveryTimeline({ milestones, carrier, trackingNumber }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
      <h2 className="text-xs font-bold mb-4 flex items-center gap-2 text-on-surface">
        <IconChart size={16} className="text-primary" weight="regular" />
        Delivery Progress
      </h2>

      <div className="relative pl-9 space-y-5">
        <div className="absolute left-[17px] top-1 bottom-1 w-0.5 bg-primary/20" />

        {milestones.map((m) => (
          <div key={m.id} className={`relative ${m.status === "pending" ? "opacity-40" : ""}`}>
            <div className={`absolute -left-9 top-0 rounded-full flex items-center justify-center z-10 ${CIRCLE[m.status]}`}>
              {(() => { const MI = MILESTONE_ICON_MAP[m.icon] ?? IconCheck; return <MI size={15} weight={m.iconFill ? "fill" : "regular"} />; })()}
            </div>
            <div className="pt-0.5">
              <h3 className={`text-xs font-bold ${m.status === "active" ? "text-primary" : "text-on-surface"}`}>
                {m.label}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{m.detail}</p>
              {m.status === "active" && carrier && (
                <div className="mt-2 inline-flex flex-col px-3 py-1.5 bg-surface-container-low rounded-lg border border-primary/10">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Carrier: {carrier}</span>
                  <span className="text-[10px] text-on-surface-variant">Tracking: {trackingNumber}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
