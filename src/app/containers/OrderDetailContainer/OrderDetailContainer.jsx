"use client";

import { useState } from "react";
import { IconCancel, IconWarning } from "@/lib/icons";
import useOrderDetailContainer from "./OrderDetailContainer.hook";
import OrderDetailHeader  from "./Components/OrderDetailHeader";
import TrackingProgress   from "./Components/TrackingProgress";
import OrderDetailItems   from "./Components/OrderDetailItems";
import ShippingPaymentCard from "./Components/ShippingPaymentCard";
import OrderSummaryCard   from "./Components/OrderSummaryCard";
import MiniMap            from "./Components/MiniMap";

export default function OrderDetailContainer({ orderId }) {
  const { order, loading, error } = useOrderDetailContainer(orderId);
  const [cancelStep, setCancelStep] = useState("idle"); // idle | confirm | done

  if (loading || !order) {
    return (
      <div className="py-16 text-center text-xs text-on-surface-variant">
        {error ? `Error: ${error}` : "Loading order…"}
      </div>
    );
  }

  const displayId = order.orderId ?? order._id?.toString() ?? "—";
  const orderKey  = order._id?.toString() ?? order.orderId ?? "";
  const placedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const placedTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  const canCancel = order.status === "Order Confirmed" || order.status === "Pending";

  return (
    <main className="py-2">

      {/* Breadcrumb + heading + action buttons */}
      <OrderDetailHeader
        orderId={displayId}
        orderKey={orderKey}
        date={placedDate}
        time={placedTime}
        status={order.status}
      />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Left: tracking + items */}
        <div className="lg:col-span-8 space-y-gutter">
          <TrackingProgress
            activeStep={order.activeStep}
            trackingNote={order.trackingNote}
          />
          <OrderDetailItems items={order.items} />
        </div>

        {/* Right: shipping/payment + summary + mini map + cancel */}
        <div className="lg:col-span-4 space-y-gutter">
          <ShippingPaymentCard
            shippingAddress={order.shippingAddress}
            paymentMethod={order.paymentMethod}
          />
          <OrderSummaryCard
            subtotal={order.subtotal}
            shippingCost={order.shipping}
            tax={order.tax}
            discount={order.discount}
            total={order.total}
          />
          <MiniMap />

          {/* Cancel Order — inline flow, only for cancellable statuses */}
          {canCancel && (
            <div className="bg-white/80 dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-on-surface flex items-center gap-2">
                <IconCancel size={16} className="text-error" weight="regular" />
                Cancel Order
              </h3>

              {cancelStep === "idle" && (
                <>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Cancellations made before shipping are fully refunded within 3–5 business days.
                  </p>
                  <button
                    onClick={() => setCancelStep("confirm")}
                    className="w-full py-2 bg-error text-white rounded-lg text-xs font-bold hover:bg-error/90 active:scale-95 transition-all cursor-pointer border-none shadow-sm"
                  >
                    Cancel This Order
                  </button>
                </>
              )}

              {cancelStep === "confirm" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-error/5 rounded-lg border border-error/20">
                    <IconWarning size={16} className="text-error shrink-0" weight="regular" />
                    <p className="text-[10px] text-error font-semibold leading-relaxed">
                      Are you sure? This action cannot be undone. Your refund will be processed in 3–5 days.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCancelStep("done")}
                      className="flex-1 py-2 bg-error text-white rounded-lg text-xs font-bold hover:bg-error/90 active:scale-95 transition-all cursor-pointer border-none shadow-sm"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setCancelStep("idle")}
                      className="flex-1 py-2 bg-surface-container text-on-surface-variant rounded-lg text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer border-none"
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              )}

              {cancelStep === "done" && (
                <div className="flex items-center gap-2 p-3 bg-error/5 rounded-lg border border-error/20">
                  <IconCancel size={18} className="text-error" weight="fill" />
                  <div>
                    <p className="text-xs font-bold text-error">Order Cancelled</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Refund will be processed in 3–5 business days.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
