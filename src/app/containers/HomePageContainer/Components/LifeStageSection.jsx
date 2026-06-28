"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";
import { api } from "@/lib/api";

export default function LifeStageSection() {
  const [stages, setStages] = useState([]);

  useEffect(() => {
    api.get("/catalog?type=lifeStage")
      .then(data => setStages(data.items ?? []))
      .catch(() => setStages([]));
  }, []);

  if (!stages.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">
      <div className="text-center mb-4">
        <h2 className="text-sm font-bold text-on-surface">Shop by Life Stage</h2>
        <p className="text-[11px] text-on-surface-variant mt-0.5">Tailored nutrition for every chapter of their life</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {stages.map((stage) => {
          const label = stage.name;
          const image = stage.imageUrl || stage.icon;
          const href  = `/marketplace?stage=${stage.slug}`;
          const sub   = stage.sub || "";
          return (
            <Link key={stage._id ?? stage.slug} href={href} className="group relative overflow-hidden rounded-xl shadow-card-sm hover:shadow-card-md transition-all duration-200">
              <div className="aspect-[4/3] overflow-hidden">
                {image && typeof image === "string" && image.startsWith("http") ? (
                  <img
                    alt={label}
                    src={image}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center text-4xl">
                    {image || label.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-3">
                <h3 className="text-white text-xs font-bold leading-tight">{label}</h3>
                <div className="flex items-center justify-between mt-0.5">
                  {sub && <p className="text-white/75 text-[10px]">{sub}</p>}
                  <IconArrowRight size={14} className="text-white/80 group-hover:translate-x-0.5 transition-transform ml-auto" weight="regular" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
