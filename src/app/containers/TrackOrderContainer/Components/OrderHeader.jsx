"use client";

export default function OrderHeader({ order }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
      <div>
        <h1 className="text-base font-extrabold text-primary mb-1">Track Your Order</h1>
        <p className="text-xs text-on-surface-variant">
          Order #{order.id} &bull; Placed on {order.date}
        </p>
      </div>

      {/* Status badge */}
      <div className="bg-primary-fixed text-on-primary-fixed px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 self-start md:self-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft flex-shrink-0" />
        {order.status}
      </div>
    </div>
  );
}
