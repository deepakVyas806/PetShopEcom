"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[380px] overflow-hidden w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="Elevated Care for Every Companion"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcMLlXcu8SrlbiwnkM8pqYLwiBhQshPT4bfQphoU5Tla8cLgAKLMzbl3GXifcuCBlZ9IfQFnpxiBWc_tphc1--W_B5oFJPQd8Bb1xaQee7KJYjCoTxHXWLLq0AxLKubnKofa_uUbUJgrk6RkOQl4pIJWoI4t83MvYp0J75JDXmHAZLfNXvcGY2HZnJm7QeguizdMzDg-A6GxcFWN-gP0Cy71JN7pZS3amuRzO9EA6rg4_dsLjeVYGQ5r41PRF24xIXNz7ycSpQBTc5"
      />

      {/* Overlay + copy — inline gradient so it's immune to Tailwind v4 CSS-var issues */}
      <div
        className="absolute inset-0 flex items-center px-4 md:px-margin-desktop"
        style={{ background: "linear-gradient(to right, rgba(21,28,39,0.55) 0%, rgba(21,28,39,0.2) 55%, transparent 100%)" }}
      >
        <div className="max-w-md text-white space-y-3">
          <h1 className="text-base font-extrabold leading-snug drop-shadow-sm">
            Elevated Care for Every Companion
          </h1>
          <p className="text-xs opacity-90 leading-relaxed drop-shadow-sm max-w-xs">
            Curated premium nutrition and artisanal accessories for the modern pet owner.
          </p>
          <Link
            href="/marketplace"
            className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            Shop Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
