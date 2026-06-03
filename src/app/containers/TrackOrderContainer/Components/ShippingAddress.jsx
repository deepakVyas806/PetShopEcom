"use client";

export default function ShippingAddress({ address }) {
  return (
    <section className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>home_pin</span>
        <h2 className="text-sm font-bold text-on-surface">Shipping Address</h2>
      </div>

      <div className="space-y-0.5 text-xs text-on-surface-variant">
        <p className="font-semibold text-on-surface">{address.name}</p>
        <p>{address.line1}</p>
        <p>{address.line2}</p>
        <p>{address.country}</p>
        <p className="flex items-center gap-1.5 mt-2 text-on-surface">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>call</span>
          {address.phone}
        </p>
      </div>
    </section>
  );
}
