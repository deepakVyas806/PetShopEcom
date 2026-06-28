"use client";

import { useState } from "react";
import { IconHelp, IconChevronDown, IconPhone, IconMail, IconChat } from "@/lib/icons";
import useTrackOrderContainer from "./TrackOrderContainer.hook";
import OrderHeader       from "./Components/OrderHeader";
import ShippingAddress   from "./Components/ShippingAddress";
import OrderItemsSummary from "./Components/OrderItemsSummary";
import OrderTimeline     from "@/components/common/OrderTimeline";

export default function TrackOrderContainer({ orderId }) {
  const { order, loading, error } = useTrackOrderContainer(orderId);
  const [helpOpen, setHelpOpen] = useState(false);

  if (loading || !order) {
    return (
      <div className="py-16 text-center text-xs text-on-surface-variant">
        {error ? `Error: ${error}` : "Loading tracking info…"}
      </div>
    );
  }

  const displayId  = order.orderId ?? order._id?.toString() ?? "—";
  const placedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <main className="py-2">

      {/* Page heading + status */}
      <OrderHeader displayId={displayId} placedDate={placedDate} status={order.status} />

      {/* Timeline — full width */}
      <OrderTimeline status={order.status} createdAt={order.createdAt} className="mb-gutter" />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Left: items */}
        <div className="lg:col-span-7 space-y-gutter">
          <OrderItemsSummary
            items={order.items ?? []}
            subtotal={order.subtotal}
            tax={order.tax}
            discount={order.discount}
            couponCode={order.couponCode}
            shipping={order.shipping}
            total={order.total}
          />
        </div>

        {/* Right: address, carrier, help */}
        <div className="lg:col-span-5 space-y-gutter">
          <ShippingAddress address={order.shippingAddress} />

          {/* Help — collapsible */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card-sm overflow-hidden">
            <button
              onClick={() => setHelpOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 px-5 py-4 text-on-surface-variant hover:text-primary transition-all group bg-transparent cursor-pointer text-xs font-bold border-none outline-none"
            >
              <span className="flex items-center gap-2">
                <IconHelp size={15} className="text-primary group-hover:rotate-12 transition-transform" weight="regular" />
                Need help with this order?
              </span>
              <IconChevronDown
                size={14}
                className="text-primary transition-transform duration-200"
                style={{ transform: helpOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                weight="bold"
              />
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: helpOpen ? "200px" : "0px", opacity: helpOpen ? 1 : 0 }}
            >
              <div className="border-t border-outline-variant/20 px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                    <IconPhone size={13} className="text-primary" weight="regular" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant">Contact Support</p>
                    <p className="text-xs font-semibold text-on-surface">+91 1800-999-PETS</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                    <IconMail size={13} className="text-primary" weight="regular" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant">Email Us</p>
                    <p className="text-xs font-semibold text-on-surface">support@artpetshop.in</p>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:shadow-brand-sm active:scale-95 transition-all cursor-pointer border-none">
                  <IconChat size={13} weight="regular" />
                  Live Chat
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
