"use client";

import { useEffect, useRef } from "react";

export default function LeftPanel() {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.style.opacity = "0";
    const id = setTimeout(() => { img.style.opacity = "1"; }, 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      className="hidden md:flex md:w-5/12 lg:w-1/2 sticky top-0 h-screen flex-col items-center justify-center p-10 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #d2bbff 100%)" }}
    >
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpaZ0gjYUEAnR7f8qFNDM_WWwEwpP2J9oOIFrPezK_7ws3g4coLdrvOptmawTI2G65Yn4wcPGbmJxzmhdiajvgGCVnuWoLOsQbjFiXsO-fdcRNFQ5bud8_95-qiCGWJFKbuYdTg6NKCairE1GE0JGDDJ4nf8cy65MohXkuc7GeKkTrMV3oc6D7syOypJFxjK9qYWyfnYqE-AXt7LyXYRH_YOiJNZ5pde6u-kAsU6Xwc8vFG-_PWPTYtvG7rpTOjol4kp4aqtwCDYDv"
          alt="Happy Golden Retriever"
          className="w-full max-w-xs h-auto object-contain rounded-xl drop-shadow-2xl mb-6 transition-opacity duration-1000"
        />
        <h1 className="text-base font-bold text-white mb-3 leading-tight tracking-tight">
          Everything your pet needs in one place.
        </h1>
        <p className="text-xs font-medium text-white/80">
          Premium care for your most loyal companions.
        </p>
        <div className="flex items-center gap-5 mt-8 opacity-70">
          {["10k+ Happy Pets", "5★ Rated", "Free Delivery"].map((t) => (
            <span key={t} className="text-xs text-white/90 font-medium">{t}</span>
          ))}
        </div>
      </div>

      <div className="absolute top-8 left-8">
        <span className="text-sm font-bold text-white tracking-tight">artPetShop</span>
      </div>
    </section>
  );
}
