"use client";

import Link from "next/link";

const SERVICES = [
  {
    title:  "Luxury Grooming",
    sub:    "Spa treatments and stylistic grooming by certified experts.",
    cta:    "Book Now",
    href:   "/services/book",
    image:  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMJLwysOQgFEFqxPQ2utHm0N79V411N6ngWBxjSthJSlCwcYrWy6N3Fe2-p4VYvlqosgcDzKKZ3HaZY6HZioWRy6Wyk36sqKanLYp9HwF9i2ph1ZrKR9JPtxNwH1kKZH3jfXiiJhW-Pu0FDlYOmUod9LD1e7wE2Z8pohWpfhIwZEKEhHpzaLn9Z4Z6hMekVkZ01Jp6v89WuKDuH82_oyqFwrFxx7tecT09bmPLIh6YksKuePbaw_tg3yv3N7kluIWYM2p0MaQzYpTa",
  },
  {
    title:  "Vet Consultation",
    sub:    "Telehealth or in-person checkups for complete peace of mind.",
    cta:    "Schedule Visit",
    href:   "/services/book",
    image:  "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ftmhpXhyCsIRU_jQZVH3_i8vc48BJhFEAs6a6_IjxNc_DZ8H-k7XaTeTIkky4yoGCmhaFTGHivIP5Zj_aCrCufnVicBMxHuOCSoCGU2qszby6eO7IB3GbKf_iLqQAZjNw8_pAb5514qhbZaNJMu-sULQLIoBKCpX2L110v1f09jwOnJOr9a19XB9W9fk2jVdW-u-vTWVippTdM7VbBJnFWIPqyugx43gfRauoMdlYvwSslgJxAhlduFrwhR9bLe8wqO8FshbHcoU",
  },
];

export default function ServicesSection() {
  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6">
      <h2 className="text-sm font-bold text-on-surface mb-3">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map(({ title, sub, cta, href, image }) => (
          <div key={title} className="relative h-56 rounded-xl overflow-hidden group cursor-pointer shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={title}
              src={image}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/10 to-transparent flex flex-col justify-end p-5">
              <h3 className="text-white text-sm font-bold mb-1">{title}</h3>
              <p className="text-white/85 text-xs mb-3 leading-relaxed">{sub}</p>
              <Link
                href={href}
                className="w-fit border border-white text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-white hover:text-on-surface transition-colors"
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
