"use client";

import { useState } from "react";
import { IconHelp, IconChevronDown, IconPhone, IconMail, IconChat } from "@/lib/icons";
import useTrackOrderContainer from "./TrackOrderContainer.hook";
import OrderHeader        from "./Components/OrderHeader";
import DeliveryTimeline   from "./Components/DeliveryTimeline";
import MapSection         from "./Components/MapSection";
import ShippingAddress    from "./Components/ShippingAddress";
import DeliveryPartner    from "./Components/DeliveryPartner";
import OrderItemsSummary  from "./Components/OrderItemsSummary";

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

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Left: timeline + map */}
        <div className="lg:col-span-7 space-y-gutter">
          <DeliveryTimeline
            milestones={order.milestones}
            carrier={order.carrier ?? null}
            trackingNumber={order.trackingNumber ?? null}
          />
          <MapSection driver={order.driver ?? null} />
        </div>

        {/* Right: address, carrier, items, help */}
        <div className="lg:col-span-5 space-y-gutter">
          <ShippingAddress address={order.shippingAddress} />
          <DeliveryPartner carrier={order.carrier ?? null} />
          <OrderItemsSummary
            items={order.items ?? []}
            subtotal={order.subtotal}
            shipping={order.shipping}
            total={order.total}
          />

          {/* Help CTA + collapsible panel */}
          <div className="rounded-xl border border-outline-variant/50 overflow-hidden">
            <button
              onClick={() => setHelpOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 p-4 text-on-surface-variant hover:text-primary transition-all group bg-transparent cursor-pointer text-xs font-medium border-none outline-none"
            >
              <span className="flex items-center gap-2">
                <IconHelp size={18} className="group-hover:rotate-12 transition-transform" weight="regular" />
                Need help with this order?
              </span>
              <IconChevronDown
                size={16}
                className="transition-transform duration-200"
                style={{ transform: helpOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                weight="bold"
              />
            </button>

            {/* Collapsible panel */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: helpOpen ? "220px" : "0px", opacity: helpOpen ? 1 : 0 }}
            >
              <div className="border-t border-outline-variant/20 p-4 space-y-3 bg-surface-container-lowest/60">

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <IconPhone size={16} className="text-primary" weight="bold" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-medium">Contact Support</p>
                    <p className="text-xs font-bold text-on-surface">+91 1800-999-PETS</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <IconMail size={16} className="text-primary" weight="bold" />
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-medium">Email Us</p>
                    <p className="text-xs font-bold text-on-surface">support@artpetshop.in</p>
                  </div>
                </div>

                {/* Live Chat */}
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer border-none">
                  <IconChat size={14} weight="bold" />
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
