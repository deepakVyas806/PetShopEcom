"use client";

import { IconLocation, IconMoney } from "@/lib/icons";

const METHOD_LABELS = {
  card:       "Credit / Debit Card",
  netbanking: "Net Banking",
  wallet:     "Wallet",
  cod:        "Cash on Delivery",
};

export default function ShippingPaymentCard({ shippingAddress, paymentMethod }) {
  const addr = shippingAddress ?? {};
  const addrLines = [
    addr.name,
    addr.line1,
    addr.line2,
    `${addr.city ?? ""}${addr.state ? ", " + addr.state : ""}${addr.pincode ? " - " + addr.pincode : ""}`,
    addr.country,
    addr.phone ? `📞 ${addr.phone}` : null,
  ].filter(Boolean).join("\n");

  const methodLabel = METHOD_LABELS[paymentMethod] ?? paymentMethod ?? "—";

  return (
    <section
      className="p-5 rounded-xl space-y-4"
      style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: "1px solid #F3E8FF", boxShadow: "0 10px 25px -5px rgba(124,58,237,0.05)" }}
    >
      {/* Shipping address */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-primary">
          <IconLocation size={16} weight="regular" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider">Shipping Address</h3>
        </div>
        <p className="text-xs text-on-surface leading-relaxed whitespace-pre-line">
          {addrLines || "—"}
        </p>
      </div>

      <hr className="border-outline-variant/20" />

      {/* Payment method */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-primary">
          <IconMoney size={16} weight="regular" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider">Payment Method</h3>
        </div>
        <p className="text-xs text-on-surface">{methodLabel}</p>
      </div>
    </section>
  );
}
