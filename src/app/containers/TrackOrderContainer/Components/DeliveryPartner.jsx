"use client";

import { IconPaw, IconPhone } from "@/lib/icons";

export default function DeliveryPartner({ carrier }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-card-sm">
      <h3 className="text-xs font-bold text-on-surface mb-4 flex items-center gap-2">
        <IconPaw size={15} className="text-primary" weight="regular" />
        Delivery Partner
      </h3>

      {carrier ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-on-surface">{carrier}</p>
          <button className="flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/8 hover:bg-primary/15 border border-primary/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            <IconPhone size={12} weight="regular" />
            Contact
          </button>
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant">Delivery partner not yet assigned.</p>
      )}
    </section>
  );
}
