"use client";

import React from "react";
import { ShieldCheck, Truck, HeartHandshake, Headphones } from "lucide-react";

export default function TrustIndicators() {
  const indicators = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary mb-3" />,
      title: "Certified Products",
      desc: "Every item is vet-approved"
    },
    {
      icon: <Truck className="w-10 h-10 text-primary mb-3" />,
      title: "Priority Delivery",
      desc: "Free shipping over ₹999"
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-primary mb-3" />,
      title: "Love & Care",
      desc: "Ethically sourced supplies"
    },
    {
      icon: <Headphones className="w-10 h-10 text-primary mb-3" />,
      title: "24/7 Assistance",
      desc: "Expert pet care advice"
    }
  ];

  return (
    <section className="bg-primary/5 py-12 transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {indicators.map((ind) => (
          <div key={ind.title} className="flex flex-col items-center">
            {ind.icon}
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
              {ind.title}
            </h4>
            <p className="text-on-surface-variant font-body-sm text-body-sm">
              {ind.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
