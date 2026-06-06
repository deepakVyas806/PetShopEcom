"use client";

import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";

const SERVICES = [
  {
    title: "Luxury Grooming",
    sub:   "Spa treatments and stylistic grooming by certified experts.",
    cta:   "Book Now",
    href:  "/services",
    badge: "Popular",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMJLwysOQgFEFqxPQ2utHm0N79V411N6ngWBxjSthJSlCwcYrWy6N3Fe2-p4VYvlqosgcDzKKZ3HaZY6HZioWRy6Wyk36sqKanLYp9HwF9i2ph1ZrKR9JPtxNwH1kKZH3jfXiiJhW-Pu0FDlYOmUod9LD1e7wE2Z8pohWpfhIwZEKEhHpzaLn9Z4Z6hMekVkZ01Jp6v89WuKDuH82_oyqFwrFxx7tecT09bmPLIh6YksKuePbaw_tg3yv3N7kluIWYM2p0MaQzYpTa",
  },
  {
    title: "Vet Consultation",
    sub:   "Telehealth or in-person checkups for complete peace of mind.",
    cta:   "Schedule Visit",
    href:  "/services",
    badge: null,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ftmhpXhyCsIRU_jQZVH3_i8vc48BJhFEAs6a6_IjxNc_DZ8H-k7XaTeTIkky4yoGCmhaFTGHivIP5Zj_aCrCufnVicBMxHuOCSoCGU2qszby6eO7IB3GbKf_iLqQAZjNw8_pAb5514qhbZaNJMu-sULQLIoBKCpX2L110v1f09jwOnJOr9a19XB9W9fk2jVdW-u-vTWVippTdM7VbBJnFWIPqyugx43gfRauoMdlYvwSslgJxAhlduFrwhR9bLe8wqO8FshbHcoU",
  },
];

export default function ServicesSection() {
  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">
      <div className="text-center mb-4">
        <h2 className="text-sm font-bold text-on-surface">Our Services</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">Expert care tailored to your pet's needs</p>
        <Link href="/services" className="inline-flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline mt-1">
          View All <IconArrowRight size={13} className="leading-none" weight="regular" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SERVICES.map(({ title, sub, cta, href, badge, image }) => (
          <div key={title} className="relative overflow-hidden rounded-xl group cursor-pointer shadow-sm" style={{ aspectRatio: "16/9" }}>
            <img
              alt={title}
              src={image}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-end p-4">
              {badge && (
                <span className="self-start mb-1.5 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {badge}
                </span>
              )}
              <h3 className="text-white text-xs font-bold mb-0.5">{title}</h3>
              <p className="text-white/80 text-[10px] mb-3 leading-relaxed">{sub}</p>
              <Link
                href={href}
                className="self-start border border-white/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full hover:bg-white hover:text-on-surface transition-colors"
              >
                {cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
