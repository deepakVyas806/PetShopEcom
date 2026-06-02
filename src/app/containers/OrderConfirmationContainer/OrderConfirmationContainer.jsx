"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const orderItems = [
  {
    name: "Royal Canine - Organic Blend",
    detail: "Quantity: 2",
    price: "$45.98",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8r3ZnAngundf5V-zgQqqd1irpxgMW0-14GSIPmGcxhmNqZs9S_ztbUIKPmuku8mZS3RqRfve8L7ycYlsRjUjkeAPSDFUeR4MxBd8U8V-QO2Tjp57Qed7xvoPVhyIMJmeBA2wKSqT775yD4rc8yCb2nuzFPfPSYvqdFpVugCUHfuW_GU28g6Sj3TkiwwDJgDz3TXGMH6TtrpO_WCYU96vZdQlklWQTWdk7FkaiwBfn60WocYhKIvH-F-nV8dVt7PjvQx2lxN3-e_ZJ",
  },
  {
    name: "Ceramic Minimalist Bowl",
    detail: "Color: Lavender | Quantity: 1",
    price: "$24.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDigXcJnMpMCqeN6DXerNHw6G9RK-XcJSfst0vbpPwi9hV42msOKT9Yfxpl80onq7mfaT_D6gY4dIkwG0af5M4fomEBYKFzRjGCGMHBOzng-9E85cRYvoIUGbMCbUBE24H_-oVc3CmadzGRSnBF4FJbBtZBeVYYLnEJAWDwv7izsAqzsckdVLEPMZ8UR5M_z49xoKTEEjQWBx8gZv9et4gYXK0hXhy9p20jWbi9XuibdcHW0QU7yBuyy875RT5IbBeiwIV0fxhTkPim",
  },
];

const timeline = [
  { label: "Ordered", note: "Oct 24, 10:30 AM", icon: "check", active: true },
  { label: "Packed", note: "Estimated: Today", icon: "package_2", active: true },
  { label: "Shipped", note: "Pending", icon: "local_shipping", active: false },
  { label: "Delivered", note: "Est. Oct 27", icon: "home_pin", active: false },
];

function ConfettiLayer() {
  const pieces = useMemo(() => {
    const colors = ["#7c3aed", "#d2bbff", "#630ed4", "#eaddff"];
    return Array.from({ length: 34 }, (_, index) => ({
      id: index,
      left: `${(index * 29) % 100}vw`,
      color: colors[index % colors.length],
      delay: `${(index % 9) * 0.12}s`,
      duration: `${2 + (index % 5) * 0.35}s`,
      opacity: 0.35 + (index % 5) * 0.12,
      scale: 0.6 + (index % 4) * 0.14,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-12px] h-2.5 w-2.5 rounded-sm animate-[checkout-confetti-fall_linear_forwards]"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            opacity: piece.opacity,
            transform: `scale(${piece.scale})`,
          }}
        />
      ))}
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="relative inline-block mb-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <span className="material-symbols-outlined text-primary text-5xl font-bold">check</span>
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl p-8 shadow-sm mb-6 overflow-hidden">
      <h2 className="text-sm font-semibold mb-8 flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary text-sm">local_shipping</span>
        Delivery Timeline
      </h2>
      <div className="relative">
        <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-0.5 bg-surface-variant z-0">
          <div className="h-full bg-primary w-1/3" />
        </div>
        <div className="relative z-10 flex justify-between items-start">
          {timeline.map((item) => (
            <div className="flex flex-col items-center gap-2 w-1/4" key={item.label}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-background shadow-sm ${item.active ? "bg-primary text-white" : "bg-surface-variant text-outline"}`}>
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
              </div>
              <div className="text-center">
                <p className={`text-xs font-medium ${item.active ? "text-on-surface" : "text-on-surface-variant"}`}>{item.label}</p>
                <p className="text-[10px] text-on-surface-variant">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderItems() {
  return (
    <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl p-8 shadow-sm">
      <h2 className="text-sm font-semibold mb-4 text-on-surface">Order Items</h2>
      <div className="space-y-4">
        {orderItems.map((item) => (
          <div className="flex gap-4 items-center group" key={item.name}>
            <div className="w-20 h-20 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={item.name} src={item.image} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
              <p className="text-[10px] text-on-surface-variant">{item.detail}</p>
            </div>
            <p className="text-sm font-bold text-primary">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryPanel() {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl p-8 shadow-sm">
        <h3 className="text-sm font-semibold mb-4 text-on-surface">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal</span>
            <span>$69.98</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Shipping</span>
            <span className="text-primary font-medium">FREE</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Taxes</span>
            <span>$5.60</span>
          </div>
          <div className="border-t border-outline-variant/30 pt-3 flex justify-between font-bold text-sm">
            <span className="text-on-surface">Total Paid</span>
            <span className="text-primary">$75.58</span>
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <button className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
            Track My Order
          </button>
          <button className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Download Invoice
          </button>
          <Link className="block text-center w-full py-3 text-primary text-xs font-semibold hover:bg-primary/5 rounded-full transition-all" href="/marketplace">
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-xl p-8 shadow-sm">
        <h3 className="text-sm font-semibold mb-4 text-on-surface">Delivery Address</h3>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
          <div className="text-xs text-on-surface-variant">
            <p className="font-bold text-on-surface">Alex Parker</p>
            <p>4256 Westview Terrace</p>
            <p>San Francisco, CA 94107</p>
            <p>Phone: +1 (555) 098-1234</p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">support_agent</span>
        </div>
        <div>
          <p className="text-xs font-medium text-on-surface">Need help?</p>
          <p className="text-[10px] text-primary underline cursor-pointer">Chat with our Pet Experts</p>
        </div>
      </div>
    </aside>
  );
}

export default function OrderConfirmationContainer() {
  const [copied, setCopied] = useState(false);
  const orderId = "#APS-829103-24";

  useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  };

  return (
    <div className="bg-background font-sans text-on-background min-h-screen">
      <ConfettiLayer />
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <section className="lg:col-span-12 text-center py-6">
            <SuccessIcon />
            <h1 className="text-xl md:text-3xl font-bold text-on-surface mb-2">Order Confirmed!</h1>
            <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
              Thank you for your purchase. We&apos;ve sent a confirmation email to <span className="font-semibold text-primary">alex.p@example.com</span>.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant">
              <span className="text-[10px] text-on-surface-variant">Order ID:</span>
              <span className="font-bold text-on-surface text-sm">{orderId}</span>
              <button className="material-symbols-outlined text-sm hover:text-primary cursor-pointer" onClick={handleCopy} aria-label="Copy order ID">
                {copied ? "check" : "content_copy"}
              </button>
            </div>
          </section>

          <section className="lg:col-span-8">
            <Timeline />
            <OrderItems />
          </section>
          <SummaryPanel />
        </div>
      </main>
    </div>
  );
}
