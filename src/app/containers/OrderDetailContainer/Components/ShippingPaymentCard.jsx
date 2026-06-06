"use client";

import { IconLocation, IconMoney } from "@/lib/icons";

export default function ShippingPaymentCard({ shipping, payment }) {
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
          {shipping.address}
        </p>
      </div>

      <hr className="border-outline-variant/20" />

      {/* Payment method */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-primary">
          <IconMoney size={16} weight="regular" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider">Payment Method</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded bg-surface-container flex items-center justify-center border border-outline-variant/20 flex-shrink-0">
            <span className="text-[9px] font-bold text-primary">VISA</span>
          </div>
          <p className="text-xs text-on-surface">{payment.label}</p>
        </div>
      </div>
    </section>
  );
}
