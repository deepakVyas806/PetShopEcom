"use client";

import Link from "next/link";
import { fmt } from "@/lib/currency";
import { IconStar, IconClock, IconInfo, IconCalendar } from "@/lib/icons";

function getNextSlots(serviceId) {
  const seed = (serviceId?.charCodeAt(0) ?? 0) + (serviceId?.charCodeAt(1) ?? 0);
  const allSlots = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];
  const start = seed % allSlots.length;
  return allSlots.slice(start, start + 3).concat(allSlots.slice(0, Math.max(0, start + 3 - allSlots.length)));
}

export default function ServiceCard({ service }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">

      {/* Image — clicking navigates to detail page */}
      <Link href={`/services/${service._id ?? service.id}`} className="relative h-52 overflow-hidden block">
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
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded-lg text-primary text-xs font-bold shadow-card-sm">
          <IconStar size={13} weight="fill" />
          {service.rating} ({service.reviewCount})
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            {/* Title links to detail page */}
            <Link href={`/services/${service._id ?? service.id}`} className="hover:text-primary transition-colors">
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

        {/* Available time slots */}
        <div className="mb-3">
          <p className="text-[10px] text-on-surface-variant font-semibold mb-1.5 flex items-center gap-1">
            <IconCalendar size={11} weight="regular" />
            Today&apos;s available slots
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {getNextSlots(service._id ?? service.id).map((slot) => (
              <span key={slot} className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full">
                {slot}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-auto">
          <Link
            href={`/services/book?serviceId=${service._id ?? service.id}`}
            className="flex-1 py-2.5 px-4 bg-primary text-white font-bold text-xs rounded-xl shadow-brand-sm hover:brightness-110 active:scale-95 transition-all text-center"
          >
            Book Now
          </Link>
          <Link
            href={`/services/${service._id ?? service.id}`}
            className="w-9 h-9 flex items-center justify-center bg-secondary-container text-primary rounded-full hover:bg-primary hover:text-white transition-all shrink-0"
          >
            <IconInfo size={18} weight="regular" />
          </Link>
        </div>
      </div>
    </div>
  );
}
