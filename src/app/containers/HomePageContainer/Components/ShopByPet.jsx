"use client";

import React from "react";
import Link from "next/link";

export default function ShopByPet() {
  const pets = [
    {
      name: "Dogs",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhzSHTfxd_ce2WW2sI8D--QvAPX3wqmfBERa-ENUssC7a5oj64YsOVt1EsGke9EwNoi-UoFfhJT5CxDIvlkYPnBG2hPxDOAnyJZNvqw4J9r2moSsZK7EK_pViPdB-SVPMnOh4uS-3lGRohFE2k6euILgcMkYlKhMoVHg34d03WpLJ78wj7KTBpfp6D25SDSaaZ-nPBFbBPNYK-1J_GdUotyDZnkLV1jckJY6VgAScSwk_IQD4ZZQGz6DUmKLqF-MF76xn6U4_7koYH",
      href: "/marketplace?category=dogs"
    },
    {
      name: "Cats",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-2dr4axG5LdAQme_h1Sueo6Mzok2bfUdtLCbJGsvGKPALuz50CtPMMZ3gQZWtUED5_VznzI6hOWp7Ff8ttNWOtV5ht9MDpXIljoQ2JMWvvfkT_o8apC4bwaqHm6JgNs9LZBTc5llKNPU_vrLzUYI1R0JrhUcPRuuzE6X0FTn8LQdhMh1cLx8k8DV8rCJj9FqnpSPqgc2ed5GcjYOJayjcXUqG6RRc-mX4iMKSjqyiGQoq_gvqxCT3vgTO18Z8T129b2QWRIQMlWUc",
      href: "/marketplace?category=cats"
    },
    {
      name: "Birds",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNk_H_qETyoPl4kXFckjk8ocHSQKKWX1TQ7-YoZO3x-yXNJ2DTdJq4_9-JcjMf5B-FZT55W2KUV8k0RlBhqvFpYJFqsQZ2_XXsYgfb4QubspcpY7rAmf2FADYduwo2CtDH5oW9KdFv_teEWRCr3whDtgFa0n2RR39yrEc1Jtb00rEzsOUPYXrYbjtTFTT2vAr1x7le5J10u-PyVStFfP0e6Z-BOSV7tFRsxc7o9q1BM2DMbQJfNlV4Nbyr9bjbmoUohgAAgg7EEumZ",
      href: "/marketplace?category=exotics"
    },
    {
      name: "Fish",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVJ6sCFW8hn29kwdU0TLsD_R6o3Ei_Sz5Uc3I28CKwxOHXqd_eb-Z5Gh4PGQxnHPaKeOfO9MSPd_FsPK7UyjVJFzziI5CddU9MQTo7eILIf5ZMFIMGTJIYqV5CA5iuW4t-4giBbRbdt-3UYRUPiE35TRu5g8dKX3VyKEfBGPAGVAbto9feqTYugtPdmSt39a5i20aSE___K2XODwyW1_DtE-GTSfPYuRmtEh9U9M6Ga0DSd0DU5N_nJIN1wIJykgdQoKXhOqWKXmzT",
      href: "/marketplace?category=exotics"
    },
    {
      name: "Small Pets",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3LbEBvB903zjSUXfw4kM9Z1UaaUXgTuSxRhPLASfj1ItCElirDtlTT7zu1BgZlZnYByyRNeaFfLiK3Q9j8W3B2hJe9DhS7wyfrHPP2atdQqIJRH79gCJc-z5b3r9QlG12QWfMYeZErI0rOVfa5M4Q89iZz1e8EMxSSoYc4zoHCk8CgBV10pYaTZyHTsdoRY1MHyy-eGNAwpGEuy72Jd-uddJ8DvvrGjyWBW-cKYBBgI0bwcgmSQBPTMa9CoETFCE2mVEpLjELB5l",
      href: "/marketplace?category=exotics"
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 text-left">
      <h2 className="font-headline-md text-headline-md mb-6 text-on-surface">Shop by Pet</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {pets.map((pet) => (
          <Link key={pet.name} href={pet.href} className="group cursor-pointer">
            <div className="aspect-square rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 mb-3 relative shadow-sm">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={`Shop supplies for ${pet.name}`}
                src={pet.image} 
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-label-md text-label-md text-center group-hover:text-primary transition-colors font-semibold">
              {pet.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
