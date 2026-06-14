"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fmt } from "@/lib/currency";
import { Card, Button, SectionHeader } from "@/components/ui";
import {
  IconCheckCircle, IconPackage, IconShipping, IconHome,
  IconCheck, IconCopy, IconLocation, IconDownload, IconCard, IconSupport,
} from "@/lib/icons";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/* ── Timeline helpers ── */
const TIMELINE_DEFS = [
  { label: "Ordered",   Icon: IconCheckCircle },
  { label: "Packed",    Icon: IconPackage     },
  { label: "Shipped",   Icon: IconShipping    },
  { label: "Delivered", Icon: IconHome        },
];
const STATUS_ORDER = ["Confirmed", "Processing", "Shipped", "Delivered"];

function buildTimeline(status, createdAt) {
  const orderedNote = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "Confirmed";
  const notes = [orderedNote, "Est. processing", "Pending", "Pending"];
  const doneUpTo = STATUS_ORDER.indexOf(status ?? "Confirmed");
  return TIMELINE_DEFS.map((def, i) => ({ ...def, note: notes[i], done: i <= doneUpTo }));
}

/* ── Confetti ── */
function ConfettiLayer() {
  const pieces = useMemo(() => {
    const colors = ["#7c3aed", "#d2bbff", "#630ed4", "#eaddff", "#a78bfa"];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${(i * 31) % 100}vw`,
      color: colors[i % colors.length],
      delay: `${(i % 8) * 0.14}s`,
      duration: `${2.2 + (i % 5) * 0.3}s`,
      opacity: 0.4 + (i % 4) * 0.12,
      scale: 0.55 + (i % 4) * 0.15,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-12px] w-2 h-2 rounded-sm animate-[checkout-confetti-fall_linear_forwards]"
          style={{ left: p.left, backgroundColor: p.color, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity, transform: `scale(${p.scale})` }}
        />
      ))}
    </div>
  );
}

/* ── Hero ── */
function Hero({ orderId, userEmail, onCopy, copied }) {
  return (
    <div className="text-center py-6 px-4">
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <IconCheckCircle size={36} className="text-primary" weight="fill" />
      </div>
      <h1 className="text-lg md:text-2xl font-extrabold text-on-surface tracking-tight mb-1">Order Confirmed!</h1>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
        Thank you! A confirmation has been sent to{" "}
        <span className="font-semibold text-primary">{userEmail || "your email"}</span>.
      </p>
      <button
        onClick={onCopy}
        className="mt-3 inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
      >
        <span className="text-[10px] text-on-surface-variant">Order</span>
        <span className="font-bold text-on-surface text-xs">{orderId}</span>
        {copied
          ? <IconCheck size={16} className="text-on-surface-variant hover:text-primary transition-colors" weight="bold" />
          : <IconCopy  size={16} className="text-on-surface-variant hover:text-primary transition-colors" weight="regular" />}
      </button>
    </div>
  );
}

/* ── Delivery Timeline ── */
function Timeline({ steps }) {
  if (!steps.length) return null;
  const doneCount  = steps.filter(s => s.done).length;
  const progressPct = ((doneCount - 1) / (steps.length - 1)) * 100;

  return (
    <Card>
      <SectionHeader title="Delivery Timeline" icon={<IconShipping size={16} weight="regular" />} className="mb-4" />

      {/* Desktop: horizontal */}
      <div className="hidden sm:block relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-variant z-0">
          <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-1.5 w-1/4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-background shadow-sm transition-all ${step.done ? "bg-primary text-white" : "bg-surface-variant text-outline"}`}>
                <step.Icon size={16} weight={step.done ? "fill" : "regular"} />
              </div>
              <p className={`text-[10px] font-semibold ${step.done ? "text-on-surface" : "text-on-surface-variant"}`}>{step.label}</p>
              <p className="text-[9px] text-on-surface-variant text-center">{step.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden space-y-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary text-white" : "bg-surface-variant text-outline"}`}>
                <step.Icon size={14} weight={step.done ? "fill" : "regular"} />
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${step.done ? "bg-primary" : "bg-surface-variant"}`} />
              )}
            </div>
            <div className="pb-4">
              <p className={`text-xs font-semibold leading-tight ${step.done ? "text-on-surface" : "text-on-surface-variant"}`}>{step.label}</p>
              <p className="text-[10px] text-on-surface-variant">{step.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Order Items ── */
function OrderItems({ items }) {
  if (!items?.length) return null;
  return (
    <Card>
      <SectionHeader title="Order Items" className="mb-3" />
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.productId ?? idx} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{item.name}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="text-xs font-bold text-primary shrink-0">{fmt(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Summary Panel ── */
function SummaryPanel({ order, loading }) {
  if (loading) {
    return (
      <aside className="lg:col-span-4 space-y-3">
        <Card><p className="text-xs text-on-surface-variant text-center py-6">Loading order details…</p></Card>
      </aside>
    );
  }

  const addr = order?.shippingAddress ?? {};
  const rows = order ? [
    ["Subtotal",  fmt(order.subtotal ?? 0),                          false],
    ["Shipping",  order.shipping === 0 ? "FREE" : fmt(order.shipping ?? 0), order.shipping === 0],
    ["Taxes",     fmt(order.tax ?? 0),                               false],
    ...(order.discount > 0 ? [["Discount", `−${fmt(order.discount)}`, true]] : []),
  ] : [];

  return (
    <aside className="lg:col-span-4 space-y-3">
      <Card>
        <SectionHeader title="Order Summary" className="mb-3 pb-2 border-b border-outline-variant/20" />
        <div className="space-y-2">
          {rows.map(([label, value, green]) => (
            <div key={label} className="flex justify-between text-xs text-on-surface-variant">
              <span>{label}</span>
              <span className={green ? "text-green-600 font-bold" : "font-medium text-on-surface"}>{value}</span>
            </div>
          ))}
          {order && (
            <div className="border-t border-outline-variant/20 pt-2 flex justify-between text-xs font-bold">
              <span className="text-on-surface">Total Paid</span>
              <span className="text-primary">{fmt(order.total ?? 0)}</span>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <Button href="/orders" fullWidth>
            <IconLocation size={16} weight="regular" />
            Track My Order
          </Button>
          <Button variant="secondary" fullWidth>
            <IconDownload size={16} weight="regular" />
            Download Invoice
          </Button>
          <Button variant="ghost" href="/marketplace" fullWidth>
            Continue Shopping
          </Button>
        </div>
      </Card>

      {(addr.name || addr.line1) && (
        <Card>
          <SectionHeader title="Delivery Address" className="mb-3" />
          <div className="flex gap-2.5">
            <IconLocation size={18} className="text-primary shrink-0 mt-0.5" weight="regular" />
            <div className="text-xs text-on-surface-variant space-y-0.5">
              {addr.name   && <p className="font-bold text-on-surface">{addr.name}</p>}
              {addr.line1  && <p>{addr.line1}</p>}
              {addr.city   && <p>{addr.city}{addr.pincode ? `, ${addr.pincode}` : ""}</p>}
              {addr.phone  && <p className="mt-1 text-[10px]">{addr.phone}</p>}
            </div>
          </div>
        </Card>
      )}

      {order?.paymentMethod && (
        <Card>
          <SectionHeader title="Payment" className="mb-3" />
          <div className="flex items-center gap-2.5">
            <IconCard size={18} className="text-primary" weight="regular" />
            <p className="text-xs font-semibold text-on-surface">{order.paymentMethod}</p>
          </div>
        </Card>
      )}

      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <IconSupport size={18} weight="regular" />
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface">Need help?</p>
          <p className="text-[10px] text-primary underline cursor-pointer">Chat with our Pet Experts</p>
        </div>
      </div>
    </aside>
  );
}

/* ── Root ── */
export default function OrderConfirmationContainer() {
  const searchParams = useSearchParams();
  const { user }     = useAuth();
  const orderId      = searchParams.get("orderId");

  const [order,        setOrder]        = useState(null);
  const [orderLoading, setOrderLoading] = useState(!!orderId);
  const [copied,       setCopied]       = useState(false);

  useEffect(() => {
    if (!orderId) return;
    api.get(`/orders/${orderId}`)
      .then(data => setOrder(data.order ?? null))
      .catch(() => {})
      .finally(() => setOrderLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const displayOrderId  = order?.orderId ?? (orderId ? `#${orderId.slice(-8).toUpperCase()}` : "#APS-000000");
  const timelineSteps   = useMemo(() => buildTimeline(order?.status, order?.createdAt), [order]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayOrderId);
    setCopied(true);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <ConfettiLayer />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 md:py-8 w-full">

        <Hero
          orderId={displayOrderId}
          userEmail={user?.email ?? ""}
          onCopy={handleCopy}
          copied={copied}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-gutter mt-4 items-start">

          {/* Left */}
          <section className="lg:col-span-8 space-y-3">
            <Timeline steps={timelineSteps} />
            {orderLoading
              ? <Card><p className="text-xs text-on-surface-variant text-center py-6">Loading order items…</p></Card>
              : <OrderItems items={order?.items ?? []} />}
          </section>

          {/* Right */}
          <SummaryPanel order={order} loading={orderLoading} />

        </div>
      </main>
    </div>
  );
}
