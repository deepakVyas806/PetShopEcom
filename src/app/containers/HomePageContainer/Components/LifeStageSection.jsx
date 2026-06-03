"use client";

import Link from "next/link";

const STAGES = [
  {
    label: "Puppy & Kitten",
    href:  "/marketplace?stage=puppy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFT6_uTtQIgMpAzldAeCLnozuDePGIHo9A-xqACNn7NgD2aS5SbuZecBsT4SFzlQhNJO_Cxi-gRO0OUwIXB0wLc5a1jAQED1_xnopyRrFn8gPKm1n5LlHkhkQ9omF4sLZmF8gqWg_iZtlX2oxU7eAzD9IBFAr7LuyMkQtQomSq_EkHbJY753b3_m9PAbCgEk30XQCYt-eMjscWoTuXrVnu5ofJaH6XgG8D3LYDipMbKAE8JaUHMM-eLbjwlABJ9Es-gWav-noneOKC",
  },
  {
    label: "Adult",
    href:  "/marketplace?stage=adult",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsOg-2L1a179TkNLrLFmUOe2BWMi-XI8lujXm-CpzYZ-XcfjL1jOEBXRhZWONERuMiT0mNELxBSQnUsRgMU8WRTXZyoi94MgJZO227BA8jZWv_PNlRJiZcasZk6qDfMDQ98MCBUVA5W3iu3kycUA9jjA-EKCX-RueaZAVtuawyV0zgVjLI6quq10wIe5Gc3rOaBydH4AL5oFAyKZyLl_PCMH3MzT8ssbwlmFJVnwhKcuFU7aWu8RxL1n6k15-GRv8_fF_4qGpXxEbQ",
  },
  {
    label: "Senior",
    href:  "/marketplace?stage=senior",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC261Ny6iVH3Yp0azI3dM_QKw8oi6HGqxoqgk3U9HiMNoV2906jzHNv0Fg4Sb54rFEwLnEpZhej4TcUNsVPE0CUbEjDkSBY917GN_JkS9As-3k9oIGnP98Mot8nQozYnmcmB7ZuyNOoqn10QRUZ8ulRb8KnBOym1XpVQJ82T9rdC4D_kB_T1FxZZz34dUACDos6mBKZ0LtFmolrrAm1ebrLQoRkv8j15aQOnLUsKk2oXuvZz-2y76P52ZAliY5BQwtf49WZiq4X3zXa",
  },
];

export default function LifeStageSection() {
  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6">
      <h2 className="text-sm font-bold text-on-surface mb-3">Shop by Life Stage</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAGES.map(({ label, href, image }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={label}
                src={image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface">{label}</h3>
              <span className="text-xs text-primary font-semibold flex items-center gap-0.5 group-hover:underline">
                Shop Now
                <span className="material-symbols-outlined leading-none group-hover:translate-x-0.5 transition-transform" style={{ fontSize: 14 }}>
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
