"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";
import { IconStar, IconClock, IconInfo } from "@/lib/icons";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Image — clicking navigates to detail page */}
      <Link href={`/services/${service.id}`} className="relative h-52 overflow-hidden block">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {service.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-tight shadow-sm">
            {service.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-primary text-xs font-bold shadow-sm">
          <IconStar size={13} weight="fill" />
          {service.rating} ({service.reviewCount})
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            {/* Title links to detail page */}
            <Link href={`/services/${service.id}`} className="hover:text-primary transition-colors">
              <h3 className="text-sm font-bold text-on-surface mb-0.5">{service.title}</h3>
            </Link>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <IconClock size={12} weight="regular" />
              {service.duration}
            </p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <span className="text-on-surface-variant text-xs block">from</span>
            <span className="text-primary font-black text-lg leading-tight">{fmt(service.price)}</span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-4 flex-1 leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center gap-2.5 mt-auto">
          <Link
            href={`/services/book?serviceId=${service.id}`}
            className="flex-1 py-2.5 px-4 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all text-center"
          >
            Book Now
          </Link>
          <Link
            href={`/services/${service.id}`}
            className="w-9 h-9 flex items-center justify-center bg-secondary-container text-primary rounded-full hover:bg-primary hover:text-white transition-all shrink-0"
          >
            <IconInfo size={18} weight="regular" />
          </Link>
        </div>
      </div>
    </div>
  );
}
