"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight, IconBag, IconTag, IconGroom, IconPaw } from "@/lib/icons";

const SLIDES = [
  {
    id: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcMLlXcu8SrlbiwnkM8pqYLwiBhQshPT4bfQphoU5Tla8cLgAKLMzbl3GXifcuCBlZ9IfQFnpxiBWc_tphc1--W_B5oFJPQd8Bb1xaQee7KJYjCoTxHXWLLq0AxLKubnKofa_uUbUJgrk6RkOQl4pIJWoI4t83MvYp0J75JDXmHAZLfNXvcGY2HZnJm7QeguizdMzDg-A6GxcFWN-gP0Cy71JN7pZS3amuRzO9EA6rg4_dsLjeVYGQ5r41PRF24xIXNz7ycSpQBTc5",
    badge: "Premium Pet Care",
    BadgeIcon: IconPaw,
    headline: "Elevated Care for\nEvery Companion",
    sub: "Curated premium nutrition and artisanal accessories for the modern pet owner.",
    cta: { label: "Shop Now", href: "/marketplace", Icon: IconBag },
    cta2: { label: "Our Services", href: "/services" },
    overlay: "linear-gradient(to right, rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)",
  },
  {
    id: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhzSHTfxd_ce2WW2sI8D--QvAPX3wqmfBERa-ENUssC7a5oj64YsOVt1EsGke9EwNoi-UoFfhJT5CxDIvlkYPnBG2hPxDOAnyJZNvqw4J9r2moSsZK7EK_pViPdB-SVPMnOh4uS-3lGRohFE2k6euILgcMkYlKhMoVHg34d03WpLJ78wj7KTBpfp6D25SDSaaZ-nPBFbBPNYK-1J_GdUotyDZnkLV1jckJY6VgAScSwk_IQD4ZZQGz6DUmKLqF-MF76xn6U4_7koYH",
    badge: "Flash Sale",
    BadgeIcon: IconTag,
    headline: "Up to 40% Off\nDog Essentials",
    sub: "Premium food, toys and accessories — biggest savings of the season.",
    cta: { label: "Shop Deals", href: "/marketplace?category=dogs", Icon: IconTag },
    cta2: { label: "View All Offers", href: "/marketplace" },
    overlay: "linear-gradient(to right, rgba(99,14,212,0.78) 0%, rgba(99,14,212,0.30) 55%, transparent 100%)",
  },
  {
    id: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMJLwysOQgFEFqxPQ2utHm0N79V411N6ngWBxjSthJSlCwcYrWy6N3Fe2-p4VYvlqosgcDzKKZ3HaZY6HZioWRy6Wyk36sqKanLYp9HwF9i2ph1ZrKR9JPtxNwH1kKZH3jfXiiJhW-Pu0FDlYOmUod9LD1e7wE2Z8pohWpfhIwZEKEhHpzaLn9Z4Z6hMekVkZ01Jp6v89WuKDuH82_oyqFwrFxx7tecT09bmPLIh6YksKuePbaw_tg3yv3N7kluIWYM2p0MaQzYpTa",
    badge: "Expert Services",
    BadgeIcon: IconGroom,
    headline: "Luxury Grooming\nFor Every Breed",
    sub: "Spa treatments & expert styling by certified groomers. Book your slot today.",
    cta: { label: "Book Now", href: "/services", Icon: IconGroom },
    cta2: { label: "View Services", href: "/services" },
    overlay: "linear-gradient(to right, rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)",
  },
  {
    id: 4,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBB2EamYQkMxtsTC5rWmpPHITfS0vRxBjsQ7PoJAxakX8M-wNUFFieN--LKFnqn_MocaHTxA3cLPTM4k1YuOFodxHzcEJEf27y8LVUj7HKLqxYp3_QMGQvH4mGKRzxTz8-XwF7FrKfkoig7DBXohBYMnmDkvrmiqj-SpulYeo63S6U_LINkKfeTg29p46w0S5bIuGtdBrCwCHF6P6mNBucT4WTtkXAPSH6TKdfYMMd__a2OTLVtUWK5A4CU-Pegt9riLzzkKlYk8TS",
    badge: "Best Bundle",
    BadgeIcon: IconBag,
    headline: "Starter Kits\nEverything Included",
    sub: "Get the complete new-pet kit — curated essentials bundled and delivered fast.",
    cta: { label: "Shop Bundles", href: "/marketplace", Icon: IconBag },
    cta2: { label: "Learn More", href: "/marketplace" },
    overlay: "linear-gradient(to right, rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)",
  },
];

export default function HeroSection() {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const [fading, setFading]   = useState(false);

  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setActive(idx);
      setFading(false);
    }, 220);
  }, []);

  const prev = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((active + 1) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      goTo((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, goTo]);

  const slide = SLIDES[active];
  const { BadgeIcon } = slide;

  return (
    <section
      className="relative overflow-hidden w-full select-none"
      style={{ aspectRatio: "16/7", minHeight: 220 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image with fade */}
      <img
        key={slide.id}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        alt={slide.headline}
        src={slide.image}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 transition-all duration-300" style={{ background: slide.overlay }} />

      {/* Content */}
      <div className={`absolute inset-0 flex items-center px-4 md:px-margin-desktop transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
        <div className="max-w-sm text-white space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
            <BadgeIcon size={11} weight="fill" className="leading-none" />
            {slide.badge}
          </span>

          <h1 className="text-base md:text-xl font-extrabold leading-snug drop-shadow-sm whitespace-pre-line">
            {slide.headline}
          </h1>

          <p className="text-xs text-white/85 leading-relaxed max-w-xs drop-shadow-sm">
            {slide.sub}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2 rounded-full text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              <slide.cta.Icon size={14} weight="bold" className="leading-none" />
              {slide.cta.label}
            </Link>
            <Link
              href={slide.cta2.href}
              className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-5 py-2 rounded-full text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
            >
              {slide.cta2.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
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

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 ${
              i === active ? "bg-white w-5" : "bg-white/45 w-1.5 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

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
