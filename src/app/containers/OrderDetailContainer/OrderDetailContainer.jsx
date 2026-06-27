"use client";

// import { IconCancel, IconWarning } from "@/lib/icons";
import useOrderDetailContainer from "./OrderDetailContainer.hook";
import OrderDetailHeader  from "./Components/OrderDetailHeader";
import TrackingProgress   from "./Components/TrackingProgress";
import OrderDetailItems   from "./Components/OrderDetailItems";
import ShippingPaymentCard from "./Components/ShippingPaymentCard";
import OrderSummaryCard   from "./Components/OrderSummaryCard";
import MiniMap            from "./Components/MiniMap";

export default function OrderDetailContainer({ orderId }) {
  const { order, loading, error } = useOrderDetailContainer(orderId);

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

        {/* Right: shipping/payment + summary + mini map */}
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
            couponCode={order.couponCode}
            total={order.total}
          />
          <MiniMap />

          {/* Cancel Order — disabled for now */}
          {/* {canCancel && ( ... )} */}
        </div>

      </div>
    </main>
  );
}
