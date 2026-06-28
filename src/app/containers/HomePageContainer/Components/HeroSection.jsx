"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@/lib/icons";
import { api } from "@/lib/api";

const DEFAULT_OVERLAY_LEFT  = "linear-gradient(to right, rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)";
const DEFAULT_OVERLAY_RIGHT = "linear-gradient(to left,  rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)";

function HeroSkeleton() {
  return (
    <section
      className="relative overflow-hidden w-full animate-shimmer"
      style={{ aspectRatio: "16/7", minHeight: 220 }}
    >
      {/* Faux content placeholders */}
      <div className="absolute inset-0 flex items-center px-4 md:px-12">
        <div className="flex flex-col gap-3 max-w-xs">
          <div className="h-5 w-28 rounded-full bg-surface-container" />
          <div className="h-8 w-56 rounded-lg bg-surface-container" />
          <div className="h-3 w-48 rounded-full bg-surface-container" />
          <div className="h-3 w-36 rounded-full bg-surface-container" />
          <div className="flex gap-2 pt-1">
            <div className="h-8 w-24 rounded-full bg-surface-container" />
            <div className="h-8 w-28 rounded-full bg-surface-container" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const [slides,  setSlides]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [fading,  setFading]  = useState(false);

  useEffect(() => {
    api.get("/hero")
      .then(data => {
        setSlides(data.slides ?? []);
        setActive(0);
      })
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setActive(typeof idx === "function" ? idx : () => idx);
      setFading(false);
    }, 220);
  }, []);

  const prev = () => goTo((active - 1 + slides.length) % slides.length);
  const next = () => goTo((active + 1) % slides.length);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      goTo((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, goTo, slides.length]);

  if (loading) return <HeroSkeleton />;

  const slide = slides[active] ?? slides[0];
  if (!slide) return null;

  const isRight = slide.contentSide === "right";
  const overlay = slide.overlay || (isRight ? DEFAULT_OVERLAY_RIGHT : DEFAULT_OVERLAY_LEFT);

  return (
    <section
      className="relative overflow-hidden w-full select-none"
      style={{ aspectRatio: "16/7", minHeight: 220 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <img
        key={slide._id}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        alt={slide.headline}
        src={slide.imageUrl}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 transition-all duration-300" style={{ background: overlay }} />

      {/* Content */}
      <div className={`absolute inset-0 flex items-center px-4 md:px-margin-desktop transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"} ${isRight ? "justify-end" : ""}`}>
        <div className={`max-w-sm text-white space-y-3 ${isRight ? "text-right" : ""}`}>
          {slide.badge && (
            <span className={`inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider ${isRight ? "ml-auto" : ""}`}>
              {slide.badgeEmoji && <span className="text-[11px]">{slide.badgeEmoji}</span>}
              {slide.badge}
            </span>
          )}

          <h1 className="text-base md:text-xl font-extrabold leading-snug drop-shadow-sm whitespace-pre-line">
            {slide.headline}
          </h1>

          {slide.subtitle && (
            <p className="text-xs text-white/85 leading-relaxed max-w-xs drop-shadow-sm">
              {slide.subtitle}
            </p>
          )}

          <div className={`flex items-center gap-2 pt-1 ${isRight ? "justify-end" : ""}`}>
            {slide.ctaLabel && (
              <Link
                href={slide.ctaHref || "/marketplace"}
                className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2 rounded-full text-xs font-bold hover:brightness-110 hover:shadow-brand-sm active:scale-95 transition-all shadow-brand-sm"
              >
                {slide.ctaLabel}
              </Link>
            )}
            {slide.cta2Label && (
              <Link
                href={slide.cta2Href || slide.ctaHref || "/marketplace"}
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-5 py-2 rounded-full text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
              >
                {slide.cta2Label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/55 text-white rounded-full border-none cursor-pointer transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <IconChevronLeft size={18} weight="bold" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/55 text-white rounded-full border-none cursor-pointer transition-colors backdrop-blur-sm"
            aria-label="Next slide"
          >
            <IconChevronRight size={18} weight="bold" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s._id ?? i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 ${
                i === active ? "bg-white w-5" : "bg-white/45 w-1.5 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Stats strip — desktop only */}
      <div className="absolute bottom-4 right-4 md:right-margin-desktop hidden md:flex items-center gap-5">
        {[
          { value: "10k+", label: "Happy Pets" },
          { value: "5★",   label: "Rated"      },
          { value: "Free", label: "Delivery"   },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-white text-xs font-black leading-none">{value}</p>
            <p className="text-white/60 text-[9px] uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
