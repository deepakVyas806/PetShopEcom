"use client";

import useOrderDetailContainer from "./OrderDetailContainer.hook";
import OrderDetailHeader  from "./Components/OrderDetailHeader";
import TrackingProgress   from "./Components/TrackingProgress";
import OrderDetailItems   from "./Components/OrderDetailItems";
import ShippingPaymentCard from "./Components/ShippingPaymentCard";
import OrderSummaryCard   from "./Components/OrderSummaryCard";
import MiniMap            from "./Components/MiniMap";

export default function OrderDetailContainer() {
  const { order } = useOrderDetailContainer();

  return (
    <main className="py-2">

      {/* Breadcrumb + heading + action buttons */}
      <OrderDetailHeader order={order} />

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

        {/* Right: shipping/payment + summary + mini map */}
        <div className="lg:col-span-4 space-y-gutter">
          <ShippingPaymentCard
            shipping={order.shipping}
            payment={order.payment}
          />
          <OrderSummaryCard
            subtotal={order.subtotal}
            shippingCost={order.shippingCost}
            tax={order.tax}
            total={order.total}
          />
          <MiniMap />
        </div>

      </div>
    </main>
  );
}
