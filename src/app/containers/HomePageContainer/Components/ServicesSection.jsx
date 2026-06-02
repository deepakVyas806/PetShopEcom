"use client";

import React from "react";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 text-left">
      <h2 className="font-headline-md text-headline-md mb-6 text-on-surface">Our Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Luxury Grooming card */}
        <div className="relative h-80 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
            alt="Luxury Grooming Service"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMJLwysOQgFEFqxPQ2utHm0N79V411N6ngWBxjSthJSlCwcYrWy6N3Fe2-p4VYvlqosgcDzKKZ3HaZY6HZioWRy6Wyk36sqKanLYp9HwF9i2ph1ZrKR9JPtxNwH1kKZH3jfXiiJhW-Pu0FDlYOmUod9LD1e7wE2Z8pohWpfhIwZEKEhHpzaLn9Z4Z6hMekVkZ01Jp6v89WuKDuH82_oyqFwrFxx7tecT09bmPLIh6YksKuePbaw_tg3yv3N7kluIWYM2p0MaQzYpTa"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-white font-headline-md text-headline-md mb-2">Luxury Grooming</h3>
            <p className="text-white/90 font-body-sm text-body-sm mb-4 leading-relaxed">
              Spa treatments and stylistic grooming by certified experts.
            </p>
            <Link 
              href="/services/book" 
              className="w-fit border border-white text-white px-6 py-2 rounded-full font-label-md text-label-md hover:bg-white hover:text-on-surface transition-colors duration-200 text-center"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Vet Consultation card */}
        <div className="relative h-80 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
            alt="Vet Consultation Service"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ftmhpXhyCsIRU_jQZVH3_i8vc48BJhFEAs6a6_IjxNc_DZ8H-k7XaTeTIkky4yoGCmhaFTGHivIP5Zj_aCrCufnVicBMxHuOCSoCGU2qszby6eO7IB3GbKf_iLqQAZjNw8_pAb5514qhbZaNJMu-sULQLIoBKCpX2L110v1f09jwOnJOr9a19XB9W9fk2jVdW-u-vTWVippTdM7VbBJnFWIPqyugx43gfRauoMdlYvwSslgJxAhlduFrwhR9bLe8wqO8FshbHcoU"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-white font-headline-md text-headline-md mb-2">Vet Consultation</h3>
            <p className="text-white/90 font-body-sm text-body-sm mb-4 leading-relaxed">
              Telehealth or in-person checkups for complete peace of mind.
            </p>
            <Link 
              href="/services/book" 
              className="w-fit border border-white text-white px-6 py-2 rounded-full font-label-md text-label-md hover:bg-white hover:text-on-surface transition-colors duration-200 text-center"
            >
              Schedule Visit
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
