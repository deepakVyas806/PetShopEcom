"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight, IconClock, IconCalendarAdd } from "@/lib/icons";
import { api } from "@/lib/api";
import { fmt } from "@/lib/currency";


function ServiceSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/15 overflow-hidden flex flex-col">
      <div className="w-full animate-shimmer" style={{ height: 180 }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3.5 w-2/3 rounded-full animate-shimmer" />
        <div className="h-2.5 w-full rounded-full animate-shimmer" />
        <div className="h-2.5 w-4/5 rounded-full animate-shimmer" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-4 w-16 rounded-full animate-shimmer" />
          <div className="h-7 w-24 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }) {
  const title       = service.title || service.name;
  const description = service.description || service.includes?.[0] || "";
  const badge       = service.badge || "";
  const badgeCls    = badge === "Most Popular" ? "bg-orange-500" : "bg-green-600";
  const duration    = service.duration ? `${service.duration} min` : "";
  const rating      = service.rating ?? 0;
  const reviews     = service.reviewCount ?? service.reviewsCount ?? 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-card-sm hover:shadow-card-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
        <img
          alt={title}
          src={service.image || null}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {badge && (
          <span className={`absolute top-3 left-3 ${badgeCls} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow`}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{description}</p>

          {rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <span className="flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                {rating} ★
              </span>
              <span className="text-[10px] text-on-surface-variant">({reviews} reviews)</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {duration && (
              <span className="flex items-center gap-1 text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full border border-outline-variant/20">
                <IconClock size={10} weight="regular" />
                {duration}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-black text-on-surface">{fmt(service.price)}</span>
            <span className="text-[10px] text-on-surface-variant ml-1">/ session</span>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-sm"
          >
            <IconCalendarAdd size={12} weight="bold" />
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get("/services?featured=true&limit=2")
      .then(data => setServices(data.services ?? []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !services.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Expert Pet Services</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Professional care, booked in minutes</p>
        </div>
        <Link href="/services" className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
          View All <IconArrowRight size={13} weight="regular" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <ServiceSkeleton key={i} />)
          : services.slice(0, 2).map(service => (
              <ServiceCard key={service._id} service={service} />
            ))
        }
      </div>
    </section>
  );
}
