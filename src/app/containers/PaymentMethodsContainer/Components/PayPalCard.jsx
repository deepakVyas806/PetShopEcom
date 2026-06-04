"use client";

import { PAYPAL } from "../PaymentMethodsContainer.hook";

const glass = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)",
};

export default function PayPalCard() {
  return (
    <div
      className="col-span-full rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={glass}
    >
      {/* Left: logo + info */}
      <div className="flex items-center gap-4">
        {/* Circular PayPal logo container */}
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PAYPAL.logo} alt="PayPal" className="w-8" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">PayPal</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Linked to: {PAYPAL.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="px-4 py-2 border border-outline-variant rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer bg-transparent">
          Disconnect
        </button>
        <button className="px-4 py-2 bg-on-surface text-inverse-on-surface rounded-full text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none">
          Manage
        </button>
      </div>
    </div>
  );
}
