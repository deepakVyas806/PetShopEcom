"use client";

import { IconHomePin, IconPhone } from "@/lib/icons";

export default function ShippingAddress({ address }) {
  if (!address) return null;
  return (
    <section className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
      <div className="flex items-center gap-2 mb-3">
        <IconHomePin size={18} className="text-primary" weight="bold" />
        <h2 className="text-sm font-bold text-on-surface">Shipping Address</h2>
      </div>

      <div className="space-y-0.5 text-xs text-on-surface-variant">
        <p className="font-semibold text-on-surface">{address.name}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{[address.city, address.state, address.pincode].filter(Boolean).join(", ")}</p>
        <p>{address.country}</p>
        {address.phone && (
          <p className="flex items-center gap-1.5 mt-2 text-on-surface">
            <IconPhone size={14} weight="regular" />
            {address.phone}
          </p>
        )}
      </div>
    </section>
  );
}
