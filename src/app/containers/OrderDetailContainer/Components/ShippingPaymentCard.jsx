"use client";

import { IconLocation, IconCard, IconMoney } from "@/lib/icons";

const METHOD_LABELS = {
  card:       "Paid Online (Razorpay)",
  netbanking: "Paid Online (Net Banking)",
  wallet:     "Paid Online (Wallet)",
  cod:        "Cash on Delivery",
};

export default function ShippingPaymentCard({ shippingAddress, paymentMethod, razorpayPaymentId }) {
  const addr = shippingAddress ?? {};
  const isCOD = paymentMethod === "cod";
  const methodLabel = METHOD_LABELS[paymentMethod] ?? paymentMethod ?? "—";

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-card-sm space-y-4">

      {/* Shipping address */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-primary">
          <IconLocation size={15} weight="regular" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Shipping Address</h3>
        </div>
        <div className="text-xs text-on-surface leading-relaxed space-y-0.5">
          {addr.name    && <p className="font-semibold text-on-surface">{addr.name}</p>}
          {addr.line1   && <p className="text-on-surface-variant">{addr.line1}</p>}
          {addr.line2   && <p className="text-on-surface-variant">{addr.line2}</p>}
          {(addr.city || addr.state || addr.pincode) && (
            <p className="text-on-surface-variant">
              {[addr.city, addr.state].filter(Boolean).join(", ")}
              {addr.pincode ? ` — ${addr.pincode}` : ""}
            </p>
          )}
          {addr.phone && <p className="text-on-surface-variant mt-1">{addr.phone}</p>}
        </div>
      </div>

      <hr className="border-outline-variant/20" />

      {/* Payment method */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-primary">
          {isCOD ? <IconMoney size={15} weight="regular" /> : <IconCard size={15} weight="regular" />}
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Payment</h3>
        </div>
        <p className="text-xs font-semibold text-on-surface">{methodLabel}</p>
        {razorpayPaymentId && (
          <p className="text-[10px] text-on-surface-variant mt-1 font-mono break-all">
            ID: {razorpayPaymentId}
          </p>
        )}
      </div>

    </section>
  );
}
