"use client";

import Link from "next/link";
import { IconArrowRight, IconClock, IconStar, IconCalendarAdd } from "@/lib/icons";

const SERVICES = [
  {
    title:     "Luxury Grooming",
    sub:       "Spa treatments and stylistic grooming by certified experts.",
    cta:       "Book Now",
    href:      "/services",
    badge:     "Most Popular",
    badgeCls:  "bg-orange-500",
    price:     "₹599",
    duration:  "45 min",
    rating:    4.9,
    reviews:   312,
    nextSlot:  "Tomorrow, 10 AM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMJLwysOQgFEFqxPQ2utHm0N79V411N6ngWBxjSthJSlCwcYrWy6N3Fe2-p4VYvlqosgcDzKKZ3HaZY6HZioWRy6Wyk36sqKanLYp9HwF9i2ph1ZrKR9JPtxNwH1kKZH3jfXiiJhW-Pu0FDlYOmUod9LD1e7wE2Z8pohWpfhIwZEKEhHpzaLn9Z4Z6hMekVkZ01Jp6v89WuKDuH82_oyqFwrFxx7tecT09bmPLIh6YksKuePbaw_tg3yv3N7kluIWYM2p0MaQzYpTa",
  },
  {
    title:     "Vet Consultation",
    sub:       "Telehealth or in-person checkups for complete peace of mind.",
    cta:       "Schedule Visit",
    href:      "/services",
    badge:     "Online Available",
    badgeCls:  "bg-green-600",
    price:     "₹399",
    duration:  "30 min",
    rating:    4.8,
    reviews:   178,
    nextSlot:  "Today, 5 PM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ftmhpXhyCsIRU_jQZVH3_i8vc48BJhFEAs6a6_IjxNc_DZ8H-k7XaTeTIkky4yoGCmhaFTGHivIP5Zj_aCrCufnVicBMxHuOCSoCGU2qszby6eO7IB3GbKf_iLqQAZjNw8_pAb5514qhbZaNJMu-sULQLIoBKCpX2L110v1f09jwOnJOr9a19XB9W9fk2jVdW-u-vTWVippTdM7VbBJnFWIPqyugx43gfRauoMdlYvwSslgJxAhlduFrwhR9bLe8wqO8FshbHcoU",
  },
];

export default function ServicesSection() {
  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Expert Pet Services</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Professional care, booked in minutes</p>
        </div>
        <Link
          href="/services"
          className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
        >
          View All <IconArrowRight size={13} weight="regular" />
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map(({ title, sub, cta, href, badge, badgeCls, price, duration, rating, reviews, nextSlot, image }) => (
          <div key={title} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-container-lowest border border-outline-variant/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">

            {/* Image */}
            <div className="md:w-2/5 relative shrink-0 overflow-hidden" style={{ minHeight: 160 }}>
              <img
                alt={title}
                src={image}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Badge */}
              <span className={`absolute top-3 left-3 ${badgeCls} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow`}>
                {badge}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{sub}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {rating} ★
                  </span>
                  <span className="text-[10px] text-on-surface-variant">({reviews} reviews)</span>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="flex items-center gap-1 text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full border border-outline-variant/20">
                    <IconClock size={10} weight="regular" />
                    {duration}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800/40 font-medium">
                    <IconCalendarAdd size={10} weight="regular" />
                    Next: {nextSlot}
                  </span>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-on-surface">{price}</span>
                  <span className="text-[10px] text-on-surface-variant ml-1">/ session</span>
                </div>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-sm"
                >
                  <IconCalendarAdd size={12} weight="bold" />
                  {cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
