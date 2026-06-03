"use client";

export default function OrderHeader({ order }) {
  return (
    <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-sm font-bold text-on-surface mb-0.5">Track Your Order</h1>
        <p className="text-xs text-on-surface-variant">
          #{order.id} · Placed on {order.date}
        </p>
      </div>
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
        {order.status}
      </div>
    </div>
  );
}
