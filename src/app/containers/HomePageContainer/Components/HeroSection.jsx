"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[600px] overflow-hidden w-full">
      <div className="absolute inset-0 w-full h-full">
        <img 
          className="w-full h-full object-cover" 
          alt="Elevated Care for Every Companion" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcMLlXcu8SrlbiwnkM8pqYLwiBhQshPT4bfQphoU5Tla8cLgAKLMzbl3GXifcuCBlZ9IfQFnpxiBWc_tphc1--W_B5oFJPQd8Bb1xaQee7KJYjCoTxHXWLLq0AxLKubnKofa_uUbUJgrk6RkOQl4pIJWoI4t83MvYp0J75JDXmHAZLfNXvcGY2HZnJm7QeguizdMzDg-A6GxcFWN-gP0Cy71JN7pZS3amuRzO9EA6rg4_dsLjeVYGQ5r41PRF24xIXNz7ycSpQBTc5"
        />
        {/* Soft elegant gradient mask matching theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-on-surface/40 via-on-surface/15 to-transparent flex items-center px-4 md:px-10 max-w-[1280px] mx-auto w-full">
          <div className="max-w-xl text-white text-left space-y-6">
            <h1 className="font-display-lg text-display-lg leading-tight drop-shadow-sm font-bold">
              Elevated Care for Every Companion
            </h1>
            <p className="font-body-base text-body-base opacity-95 max-w-lg leading-relaxed drop-shadow-sm">
              Discover our curated selection of premium nutrition and artisanal accessories designed for the modern pet owner.
            </p>
            <div className="pt-2">
              <Link 
                href="/marketplace" 
                className="inline-block bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3.5 rounded-full font-label-md text-label-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all text-center"
              >
                Shop Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
