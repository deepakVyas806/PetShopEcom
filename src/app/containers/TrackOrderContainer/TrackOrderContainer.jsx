"use client";

import useTrackOrderContainer from "./TrackOrderContainer.hook";
import OrderHeader        from "./Components/OrderHeader";
import DeliveryTimeline   from "./Components/DeliveryTimeline";
import MapSection         from "./Components/MapSection";
import ShippingAddress    from "./Components/ShippingAddress";
import DeliveryPartner    from "./Components/DeliveryPartner";
import OrderItemsSummary  from "./Components/OrderItemsSummary";

export default function TrackOrderContainer() {
  const { order } = useTrackOrderContainer();

  return (
    <main className="py-2">

      {/* Page heading + status */}
      <OrderHeader order={order} />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Left: timeline + map */}
        <div className="lg:col-span-7 space-y-gutter">
          <DeliveryTimeline
            milestones={order.milestones}
            carrier={order.carrier}
            trackingNumber={order.trackingNumber}
          />
          <MapSection driver={order.driver} />
        </div>

        {/* Right: address, carrier, items, help */}
        <div className="lg:col-span-5 space-y-gutter">
          <ShippingAddress address={order.address} />
          <DeliveryPartner carrier={order.carrier} />
          <OrderItemsSummary
            items={order.items}
            subtotal={order.subtotal}
            shipping={order.shipping}
            total={order.total}
          />

          {/* Help CTA */}
          <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all group bg-transparent cursor-pointer text-xs font-medium">
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform" style={{ fontSize: 18 }}>
              help
            </span>
            Need help with this order?
          </button>
        </div>

      </div>
    </main>
  );
}
