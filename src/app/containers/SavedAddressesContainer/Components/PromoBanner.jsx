"use client";

import { IconArrowRight } from "@/lib/icons";

export default function PromoBanner() {
  return (
    <section className="mt-5 rounded-2xl overflow-hidden relative min-h-[160px] flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR06xfgYMB9mHXYQ6oDZM7OFBQP9l_L1amNGCN0JY4rd4QvsJEi87OnFpIqUYsldCLeu5oAXwi7Jj45nXoZ8T2DUN49XvbzfAkIRGf1SHSfjUl2abXHyfYulj79XulZZtNzl7kF4AOsI_TG3sQ1vGjn8YaWhivWXJ4JHkxb2sMAWAfPqPnPt_oL8tWQ-cucvMkIqxYZC7CItEFQOgOUgaLjcLCMzmMur11NVS4TUN_gTP2XrD1ec9hZ3zw-ASGinOReFvXBZxfrdUn"
        alt="Happy dogs in park"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(99,14,212,0.82) 0%, rgba(99,14,212,0.4) 60%, transparent 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 py-6 max-w-sm">
        <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Pro Tip</p>
        <h2 className="text-sm font-extrabold text-white leading-snug mb-2">
          Travelling with your furry friend?
        </h2>
        <p className="text-xs text-white/85 leading-relaxed mb-4">
          Order ahead to your vacation rental — treats arrive before you do.
        </p>
        <button className="inline-flex items-center gap-1.5 bg-white text-primary text-xs font-bold px-4 py-2 rounded-full hover:shadow-lg transition-all active:scale-95 border-none cursor-pointer">
          <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconArrowRight size={11} className="text-primary" weight="bold" />
          </span>
          Learn more
        </button>
      </div>
    </section>
  );
}
