"use client";

import { IconHomePin, IconPhone } from "@/lib/icons";

export default function ShippingAddress({ address }) {
  if (!address) return null;
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-card-sm">
      <h3 className="text-xs font-bold text-on-surface mb-4 flex items-center gap-2">
        <IconHomePin size={15} className="text-primary" weight="regular" />
        Shipping Address
      </h3>

      <div className="space-y-0.5 text-xs text-on-surface-variant">
        {address.name && <p className="font-semibold text-on-surface">{address.name}</p>}
        {address.line1 && <p>{address.line1}</p>}
        {address.line2 && <p>{address.line2}</p>}
        {(address.city || address.state || address.pincode) && (
          <p>{[address.city, address.state, address.pincode].filter(Boolean).join(", ")}</p>
        )}
        {address.phone && (
          <p className="flex items-center gap-1.5 mt-2 text-on-surface">
            <IconPhone size={13} weight="regular" />
            {address.phone}
          </p>
        )}
      </div>
    </section>
  );
}
