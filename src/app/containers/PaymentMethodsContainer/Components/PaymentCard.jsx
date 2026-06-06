"use client";

import { IconCheckCircle, IconDelete, IconEdit } from "@/lib/icons";

const glass = {
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid #F3E8FF",
};

export default function PaymentCard({ card, onSetDefault, onDelete }) {
  const { id, label, network, logo, last4, holder, expiry, isDefault } = card;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      style={{ ...glass, minHeight: 200 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            {label}
          </span>
          {isDefault && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full w-fit">
              <IconCheckCircle size={11} weight="fill" />
              Default
            </span>
          )}
        </div>

        {/* Network logo in rounded container */}
        <div className="w-11 h-7 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden border border-outline-variant/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={network} className="w-9 grayscale group-hover:grayscale-0 transition-all duration-300" />
        </div>
      </div>

      {/* Card number */}
      <div className="flex items-center gap-3 mt-4">
        {["••••", "••••", "••••"].map((dots, i) => (
          <span key={i} className="text-sm font-mono text-on-surface-variant tracking-widest">{dots}</span>
        ))}
        <span className="text-sm font-bold font-mono text-on-surface tracking-widest">{last4}</span>
      </div>

      {/* Holder + Expiry */}
      <div className="flex items-end justify-between mt-3">
        <div>
          <p className="text-xs text-outline uppercase tracking-wider mb-0.5">Card Holder</p>
          <p className="text-xs font-bold text-on-surface">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-outline uppercase tracking-wider mb-0.5">Expires</p>
          <p className="text-xs font-bold text-on-surface">{expiry}</p>
        </div>
      </div>

      {/* Hover actions — circular buttons */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isDefault && (
          <button
            onClick={() => onSetDefault(id)}
            className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-primary/10 hover:text-primary text-on-surface-variant text-xs font-semibold transition-all cursor-pointer border-none"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onDelete(id)}
          className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-error/10 hover:text-error text-on-surface-variant flex items-center justify-center transition-all cursor-pointer border-none"
          title="Delete"
        >
          <IconDelete size={14} weight="bold" />
        </button>
        <button
          className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-primary/10 hover:text-primary text-on-surface-variant flex items-center justify-center transition-all cursor-pointer border-none"
          title="Edit"
        >
          <IconEdit size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
