"use client";

import { ORDER_STEPS } from "../OrderDetailContainer.hook";
import { IconCheck, IconPackage, IconShipping, IconNavigate, IconHomePin, IconInfo } from "@/lib/icons";

const STEP_ICON_MAP = {
  check:         IconCheck,
  inventory:     IconPackage,
  local_shipping:IconShipping,
  hail:          IconNavigate,
  home_pin:      IconHomePin,
};

function StepCircle({ step, state }) {
  // state: "done" | "active" | "pending"
  const circleCls =
    state === "done"    ? "bg-primary text-on-primary w-9 h-9" :
    state === "active"  ? "bg-primary-container text-on-primary w-11 h-11 ring-4 ring-primary-container/20 shadow-md" :
                          "bg-surface-container-high text-on-surface-variant w-9 h-9";

  const labelCls =
    state === "active"  ? "text-primary font-bold" :
    state === "done"    ? "text-primary" :
                          "text-on-surface-variant";

  const iconKey = state === "done" ? "check" : step.icon;
  const StepIC = STEP_ICON_MAP[iconKey] ?? IconCheck;
  const iconSize = state === "active" ? 22 : 18;

  return (
    <div className="flex flex-col items-center gap-1.5 z-10">
      <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${circleCls}`}>
        <StepIC size={iconSize} weight={state === "done" ? "fill" : "regular"} />
      </div>
      <span className={`text-[10px] font-medium whitespace-nowrap ${labelCls}`}>
        {step.label}
      </span>
    </div>
  );
}

export default function TrackingProgress({ activeStep, trackingNote }) {
  return (
    <section
      className="p-5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: "1px solid #F3E8FF", boxShadow: "0 10px 25px -5px rgba(124,58,237,0.05)" }}
    >
      <h2 className="text-xs font-bold text-on-surface mb-5">Tracking Progress</h2>

      {/* Horizontal step track */}
      <div className="flex items-center px-2">
        {ORDER_STEPS.map((step, i) => {
          const state =
            i < activeStep  ? "done"   :
            i === activeStep ? "active" :
                               "pending";
          return (
            <div key={step.id} className="contents">
              <StepCircle step={step} state={state} />
              {/* Connector line */}
              {i < ORDER_STEPS.length - 1 && (
                <div
                  className="flex-grow h-0.5 mx-0.5"
                  style={{ backgroundColor: i < activeStep ? "var(--primary)" : "#E9DEF5" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Info message */}
      {trackingNote && (
        <div className="mt-4 p-3 bg-surface-container-low rounded-lg border border-primary/10 flex items-start gap-2">
          <IconInfo size={16} className="text-primary flex-shrink-0" weight="regular" />
          <p className="text-xs text-on-surface-variant leading-relaxed">{trackingNote}</p>
        </div>
      )}
    </section>
  );
}
