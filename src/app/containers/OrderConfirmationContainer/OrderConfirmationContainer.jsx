"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fmt } from "@/lib/currency";

const ORDER_ITEMS = [
  {
    name: "Royal Canine – Organic Blend",
    detail: "Qty: 2 · 12kg",
    price: 45.98,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8r3ZnAngundf5V-zgQqqd1irpxgMW0-14GSIPmGcxhmNqZs9S_ztbUIKPmuku8mZS3RqRfve8L7ycYlsRjUjkeAPSDFUeR4MxBd8U8V-QO2Tjp57Qed7xvoPVhyIMJmeBA2wKSqT775yD4rc8yCb2nuzFPfPSYvqdFpVugCUHfuW_GU28g6Sj3TkiwwDJgDz3TXGMH6TtrpO_WCYU96vZdQlklWQTWdk7FkaiwBfn60WocYhKIvH-F-nV8dVt7PjvQx2lxN3-e_ZJ",
  },
  {
    name: "Ceramic Minimalist Bowl",
    detail: "Qty: 1 · Lavender",
    price: 24.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDigXcJnMpMCqeN6DXerNHw6G9RK-XcJSfst0vbpPwi9hV42msOKT9Yfxpl80onq7mfaT_D6gY4dIkwG0af5M4fomEBYKFzRjGCGMHBOzng-9E85cRYvoIUGbMCbUBE24H_-oVc3CmadzGRSnBF4FJbBtZBeVYYLnEJAWDwv7izsAqzsckdVLEPMZ8UR5M_z49xoKTEEjQWBx8gZv9et4gYXK0hXhy9p20jWbi9XuibdcHW0QU7yBuyy875RT5IbBeiwIV0fxhTkPim",
  },
];

const TIMELINE = [
  { label: "Ordered",   note: "Oct 24, 10:30 AM", icon: "check_circle",    done: true  },
  { label: "Packed",    note: "Est. today",        icon: "package_2",       done: true  },
  { label: "Shipped",   note: "Pending",           icon: "local_shipping",  done: false },
  { label: "Delivered", note: "Est. Oct 27",       icon: "home_pin",        done: false },
];

const GLASS = "bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl shadow-sm";

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

/* ── Hero section ── */
function Hero({ orderId, onCopy, copied }) {
  return (
    <div className="text-center py-6 px-4">
      {/* Icon */}
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>

      <h1 className="text-lg md:text-2xl font-extrabold text-on-surface tracking-tight mb-1">Order Confirmed!</h1>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
        Thank you! A confirmation has been sent to{" "}
        <span className="font-semibold text-primary">alex.p@example.com</span>.
      </p>

      {/* Order ID chip */}
      <button
        onClick={onCopy}
        className="mt-3 inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
      >
        <span className="text-[10px] text-on-surface-variant">Order</span>
        <span className="font-bold text-on-surface text-xs">{orderId}</span>
        <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors">
          {copied ? "check" : "content_copy"}
        </span>
      </button>
    </div>
  );
}

/* ── Delivery Timeline ── */
function Timeline() {
  const doneCount = TIMELINE.filter((t) => t.done).length;
  const progressPct = ((doneCount - 1) / (TIMELINE.length - 1)) * 100;

  return (
    <div className={`${GLASS} p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
        <h2 className="text-xs font-bold text-on-surface">Delivery Timeline</h2>
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden sm:block relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-variant z-0">
          <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="relative z-10 flex justify-between">
          {TIMELINE.map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-1.5 w-1/4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-background shadow-sm transition-all ${step.done ? "bg-primary text-white" : "bg-surface-variant text-outline"}`}>
                <span className="material-symbols-outlined text-sm" style={step.done ? { fontVariationSettings: "'FILL' 1" } : {}}>{step.icon}</span>
              </div>
              <p className={`text-[10px] font-semibold ${step.done ? "text-on-surface" : "text-on-surface-variant"}`}>{step.label}</p>
              <p className="text-[9px] text-on-surface-variant text-center">{step.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden space-y-0">
        {TIMELINE.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary text-white" : "bg-surface-variant text-outline"}`}>
                <span className="material-symbols-outlined text-xs" style={step.done ? { fontVariationSettings: "'FILL' 1" } : {}}>{step.icon}</span>
              </div>
              {i < TIMELINE.length - 1 && (
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
    </div>
  );
}

/* ── Order Items ── */
function OrderItems() {
  return (
    <div className={`${GLASS} p-4`}>
      <h2 className="text-xs font-bold text-on-surface mb-3">Order Items</h2>
      <div className="space-y-3">
        {ORDER_ITEMS.map((item) => (
          <div key={item.name} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{item.name}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{item.detail}</p>
            </div>
            <p className="text-xs font-bold text-primary shrink-0">{fmt(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Summary Panel ── */
function SummaryPanel() {
  return (
    <aside className="lg:col-span-4 space-y-3">

      {/* Order Summary */}
      <div className={`${GLASS} p-4`}>
        <h3 className="text-xs font-bold text-on-surface mb-3 pb-2 border-b border-outline-variant/20">Order Summary</h3>
        <div className="space-y-2">
          {[
            ["Subtotal", fmt(69.98), false],
            ["Shipping", "FREE", true],
            ["Taxes", fmt(5.60), false],
          ].map(([label, value, green]) => (
            <div key={label} className="flex justify-between text-xs text-on-surface-variant">
              <span>{label}</span>
              <span className={green ? "text-green-600 font-bold" : "font-medium text-on-surface"}>{value}</span>
            </div>
          ))}
          <div className="border-t border-outline-variant/20 pt-2 flex justify-between text-xs font-bold">
            <span className="text-on-surface">Total Paid</span>
            <span className="text-primary">{fmt(75.58)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Link
            href="/orders"
            className="w-full py-2 bg-primary text-on-primary rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">location_on</span>
            Track My Order
          </Link>
          <button className="w-full py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all cursor-pointer border-none outline-none">
            <span className="material-symbols-outlined text-sm">download</span>
            Download Invoice
          </button>
          <Link
            href="/marketplace"
            className="block text-center w-full py-2 text-primary text-xs font-semibold hover:bg-primary/5 rounded-full transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Delivery Address */}
      <div className={`${GLASS} p-4`}>
        <h3 className="text-xs font-bold text-on-surface mb-3">Delivery Address</h3>
        <div className="flex gap-2.5">
          <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">location_on</span>
          <div className="text-xs text-on-surface-variant space-y-0.5">
            <p className="font-bold text-on-surface">Alex Parker</p>
            <p>4256 Westview Terrace</p>
            <p>San Francisco, CA 94107</p>
            <p className="mt-1 text-[10px]">+1 (555) 098-1234</p>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className={`${GLASS} p-4`}>
        <h3 className="text-xs font-bold text-on-surface mb-3">Payment</h3>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-base">credit_card</span>
          <div>
            <p className="text-xs font-semibold text-on-surface">Credit Card</p>
            <p className="text-[10px] text-on-surface-variant">•••• •••• •••• 4242</p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-base">support_agent</span>
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
  const [copied, setCopied] = useState(false);
  const orderId = "#APS-829103-24";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <ConfettiLayer />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 md:py-8 w-full">

        <Hero orderId={orderId} onCopy={handleCopy} copied={copied} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-gutter mt-4 items-start">

          {/* Left */}
          <section className="lg:col-span-8 space-y-3">
            <Timeline />
            <OrderItems />
          </section>

          {/* Right */}
          <SummaryPanel />

        </div>
      </main>
    </div>
  );
}
