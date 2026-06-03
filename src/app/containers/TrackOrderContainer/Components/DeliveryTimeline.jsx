"use client";

const CIRCLE_STYLE = {
  done:    "bg-primary-container text-on-primary-container",
  active:  "bg-primary text-on-primary shadow-lg ring-4 ring-primary-fixed",
  pending: "bg-surface-variant text-on-surface-variant",
};

export default function DeliveryTimeline({ milestones, carrier, trackingNumber }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 shadow-sm">
      <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>analytics</span>
        Delivery Progress
      </h2>

      <div className="relative pl-10 space-y-7">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary/25" />

        {milestones.map((m) => (
          <div
            key={m.id}
            className={`relative ${m.status === "pending" ? "opacity-40" : ""}`}
          >
            {/* Circle */}
            <div
              className={`absolute -left-10 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${CIRCLE_STYLE[m.status]}`}
            >
              <span
                className="material-symbols-outlined leading-none"
                style={{
                  fontSize: 16,
                  fontVariationSettings: m.iconFill ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {m.icon}
              </span>
            </div>

            {/* Content */}
            <div className="pt-1">
              <h3
                className={`text-xs font-bold ${
                  m.status === "active" ? "text-primary" : "text-on-surface"
                }`}
              >
                {m.label}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                {m.detail}
              </p>

              {/* Active milestone carrier info */}
              {m.status === "active" && carrier && (
                <div className="mt-2 p-2 bg-surface-container-low rounded-lg border border-primary/10 inline-block">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Carrier: {carrier}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    Tracking: {trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
