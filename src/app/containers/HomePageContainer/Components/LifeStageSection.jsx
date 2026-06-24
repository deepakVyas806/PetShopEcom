"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@/lib/icons";
import { api } from "@/lib/api";

const FALLBACK = [
  {
    name:     "Puppy & Kitten",
    sub:      "Early nutrition & essentials",
    slug:     "puppy",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFT6_uTtQIgMpAzldAeCLnozuDePGIHo9A-xqACNn7NgD2aS5SbuZecBsT4SFzlQhNJO_Cxi-gRO0OUwIXB0wLc5a1jAQED1_xnopyRrFn8gPKm1n5LlHkhkQ9omF4sLZmF8gqWg_iZtlX2oxU7eAzD9IBFAr7LuyMkQtQomSq_EkHbJY753b3_m9PAbCgEk30XQCYt-eMjscWoTuXrVnu5ofJaH6XgG8D3LYDipMbKAE8JaUHMM-eLbjwlABJ9Es-gWav-noneOKC",
  },
  {
    name:     "Adult",
    sub:      "Premium daily care",
    slug:     "adult",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsOg-2L1a179TkNLrLFmUOe2BWMi-XI8lujXm-CpzYZ-XcfjL1jOEBXRhZWONERuMiT0mNELxBSQnUsRgMU8WRTXZyoi94MgJZO227BA8jZWv_PNlRJiZcasZk6qDfMDQ98MCBUVA5W3iu3kycUA9jjA-EKCX-RueaZAVtuawyV0zgVjLI6quq10wIe5Gc3rOaBydH4AL5oFAyKZyLl_PCMH3MzT8ssbwlmFJVnwhKcuFU7aWu8RxL1n6k15-GRv8_fF_4qGpXxEbQ",
  },
  {
    name:     "Senior",
    sub:      "Joint & vitality support",
    slug:     "senior",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC261Ny6iVH3Yp0azI3dM_QKw8oi6HGqxoqgk3U9HiMNoV2906jzHNv0Fg4Sb54rFEpZhej4TcUNsVPE0CUbEjDkSBY917GN_JkS9As-3k9oIGnP98Mot8nQozYnmcmB7ZuyNOoqn10QRUZ8ulRb8KnBOym1XpVQJ82T9rdC4D_kB_T1FxZZz34dUACDos6mBKZ0LtFmolrrAm1ebrLQoRkv8j15aQOnLUsKk2oXuvZz-2y76P52ZAliY5BQwtf49WZiq4X3zXa",
  },
];

export default function LifeStageSection() {
  const [stages, setStages] = useState(FALLBACK);

  useEffect(() => {
    api.get("/catalog?type=lifeStage")
      .then(data => {
        const items = data.items ?? [];
        if (items.length > 0) setStages(items);
      })
      .catch(() => {});
  }, []);

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
            <Link key={stage._id ?? stage.slug} href={href} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all">
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
