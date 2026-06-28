"use client";

import { useEffect, useRef } from "react";

const TRUST_STATS = [
  { value: "10k+", label: "Happy Pets" },
  { value: "5★",   label: "Rated"      },
  { value: "100%", label: "Genuine"    },
];

export default function LeftPanel() {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.style.opacity = "0";
    const id = setTimeout(() => { img.style.opacity = "1"; }, 200);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      className="hidden md:flex md:w-5/12 lg:w-1/2 sticky top-0 h-screen flex-col items-start justify-between p-10 overflow-hidden"
      style={{ background: "linear-gradient(145deg, #630ed4 0%, #7c3aed 50%, #a855f7 100%)" }}
    >
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Top: Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-sm font-black leading-none">🐾</span>
          </div>
          <span className="text-white font-black text-base tracking-tight">artPetShop</span>
        </div>
      </div>

      {/* Center: Hero content */}
      <div className="relative z-10 flex flex-col items-start w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpaZ0gjYUEAnR7f8qFNDM_WWwEwpP2J9oOIFrPezK_7ws3g4coLdrvOptmawTI2G65Yn4wcPGbmJxzmhdiajvgGCVnuWoLOsQbjFiXsO-fdcRNFQ5bud8_95-qiCGWJFKbuYdTg6NKCairE1GE0JGDDJ4nf8cy65MohXkuc7GeKkTrMV3oc6D7syOypJFxjK9qYWyfnYqE-AXt7LyXYRH_YOiJNZ5pde6u-kAsU6Xwc8vFG-_PWPTYtvG7rpTOjol4kp4aqtwCDYDv"
          alt="Happy Golden Retriever"
          className="w-full max-w-xs h-auto object-contain rounded-2xl mb-6 transition-opacity duration-700"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))" }}
        />
        <h1 className="text-2xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          Everything your pet<br />needs, in one place.
        </h1>
        <p className="text-sm font-medium text-white/75 leading-relaxed">
          Premium food, grooming, vet care and more —<br />
          all curated for your most loyal companion.
        </p>
      </div>

      {/* Bottom: Stats row */}
      <div className="relative z-10 flex items-center gap-6 w-full">
        {TRUST_STATS.map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div>
              <p className="text-base font-extrabold text-white leading-none">{value}</p>
              <p className="text-[11px] text-white/65 font-medium mt-0.5">{label}</p>
            </div>
            {i < TRUST_STATS.length - 1 && (
              <div className="w-px h-6 bg-white/20 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
