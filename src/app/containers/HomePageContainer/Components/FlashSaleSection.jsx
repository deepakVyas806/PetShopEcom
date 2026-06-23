"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconLightning, IconArrowRight } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import { api } from "@/lib/api";

/* ── Countdown helpers ─────────────────────────────────────────────────────── */
function getEndTime() {
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  return end;
}

function calcRemaining(endTime) {
  const diff = Math.max(0, endTime - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

function Countdown() {
  const [end]       = useState(getEndTime);
  const [time, setTime] = useState(() => calcRemaining(getEndTime()));

  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining(end)), 1_000);
    return () => clearInterval(id);
  }, [end]);

  const seg = "flex flex-col items-center";
  const box = "bg-black/70 text-white text-sm font-black tabular-nums px-2 py-0.5 rounded min-w-[2rem] text-center leading-tight";
  const lbl = "text-[9px] text-white/60 uppercase tracking-wider mt-0.5 leading-none";

  return (
    <div className="flex items-end gap-1.5">
      <div className={seg}><span className={box}>{time.h}</span><span className={lbl}>hr</span></div>
      <span className="text-white font-black text-sm mb-3.5">:</span>
      <div className={seg}><span className={box}>{time.m}</span><span className={lbl}>min</span></div>
      <span className="text-white font-black text-sm mb-3.5">:</span>
      <div className={seg}><span className={box}>{time.s}</span><span className={lbl}>sec</span></div>
    </div>
  );
}

/* ── Deal Card ─────────────────────────────────────────────────────────────── */
function DealCard({ product }) {
  const discount =
    product.mrp && product.price && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  return (
    <Link
      href={`/marketplace/${product._id ?? product.id}`}
      className="group shrink-0 w-36 md:w-44 bg-white dark:bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/15 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount != null && discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex-1 flex flex-col">
        <p className="text-[10px] text-on-surface font-medium line-clamp-2 mb-1 leading-snug">
          {product.name}
        </p>
        <div className="mt-auto">
          <p className="text-sm font-bold text-on-surface">{fmt(product.price)}</p>
          {product.mrp && product.mrp > product.price && (
            <p className="text-[10px] text-on-surface-variant line-through">{fmt(product.mrp)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── Main Section ──────────────────────────────────────────────────────────── */
export default function FlashSaleSection({ addedItems, handleAddToCart }) {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8&sortBy=Popularity")
      .then((data) => setDeals(data.products ?? []))
      .catch(() => {});
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="w-full overflow-hidden">
      {/* Header band */}
      <div
        className="flex items-center justify-between px-4 md:px-margin-desktop py-3"
        style={{ background: "linear-gradient(90deg, #630ed4 0%, #7c3aed 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/25">
            <IconLightning size={12} weight="fill" />
            Deal of the Day
          </span>
          <Countdown />
        </div>
        <Link
          href="/marketplace"
          className="hidden sm:flex items-center gap-1 text-white/90 text-xs font-semibold hover:text-white transition-colors"
        >
          View All <IconArrowRight size={13} weight="bold" />
        </Link>
      </div>

      {/* Horizontal scroll cards */}
      <div className="bg-surface-container-low border-b border-outline-variant/20 px-4 md:px-margin-desktop py-3">
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {deals.map((product, i) => (
            <DealCard key={product._id ?? product.id ?? i} product={product} />
          ))}
          {/* View all card */}
          <Link
            href="/marketplace"
            className="shrink-0 w-36 md:w-44 bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-colors min-h-[160px] text-center px-3"
          >
            <span className="text-primary text-2xl font-black">→</span>
            <span className="text-xs font-bold text-primary">View All Deals</span>
            <span className="text-[10px] text-on-surface-variant">{deals.length}+ products on sale</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
