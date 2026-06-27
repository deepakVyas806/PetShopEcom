"use client";
import { memo } from "react";
import { IconClose, IconDownload, IconEdit, IconPaw, IconCard, IconCheck, IconTag } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import { STATUS_STYLES, MOCK_ORDER_ITEMS, STATUS_FLOW } from "../data";

const Section = ({ title, children }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">{title}</p>
    {children}
  </div>
);

const SummaryRow = ({ label, value, bold }) => (
  <div className="flex justify-between items-center">
    <span className={bold ? "text-xs font-bold text-on-surface" : "text-[10px] text-on-surface-variant"}>
      {label}
    </span>
    <span className={bold ? "text-xs font-bold text-on-surface" : "text-[10px] text-on-surface"}>
      {value}
    </span>
  </div>
);

const OrderTimeline = memo(function OrderTimeline({ status }) {
  const activeIdx  = STATUS_FLOW.indexOf(status);
  const isClosed   = status === "Cancelled" || status === "Refunded";

  return (
    <div>
      {STATUS_FLOW.map((step, i) => {
        const done   = !isClosed && activeIdx >= 0 && i < activeIdx;
        const active = !isClosed && i === activeIdx;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                done   ? "bg-green-500" :
                active ? "bg-primary" :
                         "bg-surface-container-high border border-outline-variant"
              }`}>
                {done   && <IconCheck size={10} className="text-white" weight="bold" />}
                {active && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`w-0.5 h-5 ${done ? "bg-green-200" : "bg-outline-variant/30"}`} />
              )}
            </div>
            <div className="pb-3">
              <p className={`text-xs font-semibold ${
                active ? "text-primary" : done ? "text-on-surface" : "text-on-surface-variant"
              }`}>{step}</p>
              {(done || active) && (
                <p className="text-[10px] text-on-surface-variant">{done ? "Completed" : "In progress"}</p>
              )}
            </div>
          </div>
        );
      })}
      {isClosed && (
        <div className="flex items-start gap-3 mt-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            status === "Cancelled" ? "bg-error" : "bg-gray-400"
          }`}>
            <IconClose size={10} className="text-white" weight="bold" />
          </div>
          <div>
            <p className={`text-xs font-semibold ${status === "Cancelled" ? "text-error" : "text-gray-500"}`}>
              {status}
            </p>
            <p className="text-[10px] text-on-surface-variant">Order {status.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default memo(function OrderDetailDrawer({ order, onClose, onUpdateStatus }) {
  if (!order) return null;
  const s = STATUS_STYLES[order.status] ?? {};

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-surface shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 flex-shrink-0 bg-surface-container-low/40">
          <div>
            <p className="text-[10px] text-on-surface-variant">Order Details</p>
            <p className="text-xs font-bold text-primary font-mono">{order.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 ${s.bg} ${s.text} rounded-full text-[10px] font-bold inline-flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 ${s.dot} rounded-full flex-shrink-0`} />
              {order.status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-surface-container rounded-full transition-all cursor-pointer"
            >
              <IconClose size={15} className="text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Customer */}
          <Section title="Customer">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
              {order.avatar ? (
                <img src={order.avatar} alt={order.customer} className="w-10 h-10 rounded-full object-cover flex-shrink-0" loading="lazy" />
              ) : (
                <div className={`w-10 h-10 rounded-full ${order.avatarBg} ${order.avatarFg} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {order.initials}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-on-surface">{order.customer}</p>
                <p className="text-[10px] text-on-surface-variant">{order.email}</p>
                <p className="text-[10px] text-on-surface-variant">+1 (555) 012-3456</p>
              </div>
            </div>
          </Section>

          {/* Items */}
          <Section title="Order Items">
            <div className="space-y-2">
              {MOCK_ORDER_ITEMS.map((item) => (
                <div key={item.sku} className="flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconPaw size={16} className="text-primary/70" weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">{item.name}</p>
                    <p className="text-[10px] text-on-surface-variant">SKU: {item.sku} · Qty: {item.qty}</p>
                  </div>
                  <p className="text-xs font-bold text-on-surface flex-shrink-0">{item.unitPrice}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Summary */}
          <Section title="Order Summary">
            <div className="bg-surface-container-low rounded-xl p-3 space-y-2">
              <SummaryRow label="Subtotal" value={fmt(order.subtotal)} />
              <SummaryRow label="Shipping" value={order.shipping === 0 ? "FREE" : fmt(order.shipping)} />
              <SummaryRow label="Tax" value={fmt(order.tax)} />
              {order.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-green-600 flex items-center gap-1">
                    <IconTag size={10} weight="fill" />
                    {order.couponCode ? (
                      <span>
                        Discount&nbsp;
                        <span className="font-bold bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded text-[9px]">
                          {order.couponCode}
                        </span>
                      </span>
                    ) : "Discount"}
                  </span>
                  <span className="text-[10px] font-bold text-green-600">−{fmt(order.discount)}</span>
                </div>
              )}
              <hr className="border-outline-variant/30 my-1" />
              <SummaryRow label="Total" value={order.amount} bold />
            </div>
          </Section>

          {/* Shipping */}
          <Section title="Shipping Address">
            <div className="bg-surface-container-low rounded-xl p-3">
              <p className="text-xs font-semibold text-on-surface">{order.customer}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                42 Maple Street, Apt 3B<br />
                San Francisco, CA 94102<br />
                United States
              </p>
            </div>
          </Section>

          {/* Payment */}
          <Section title="Payment Method">
            <div className="flex items-center gap-2.5 p-3 bg-surface-container-low rounded-xl">
              <div className="w-8 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                <IconCard size={14} className="text-primary" weight="bold" />
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Visa •••• 4242</p>
                <p className="text-[10px] text-on-surface-variant">Expires 09/26</p>
              </div>
              <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                Paid
              </span>
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Status Timeline">
            <OrderTimeline status={order.status} />
          </Section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-outline-variant/30 flex gap-2 flex-shrink-0 bg-surface-container-low/30">
          <button
            onClick={() => onUpdateStatus(order)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <IconEdit size={13} weight="bold" /> Update Status
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 border border-outline-variant bg-surface rounded-xl text-xs font-semibold hover:bg-surface-container-low transition-all cursor-pointer">
            <IconDownload size={13} weight="bold" /> Invoice
          </button>
        </div>
      </div>
    </>
  );
});
