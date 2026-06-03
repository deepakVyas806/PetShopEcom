"use client";

import Link from "next/link";

const PETS = [
  { name: "Dogs",       href: "/marketplace?category=dogs",       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhzSHTfxd_ce2WW2sI8D--QvAPX3wqmfBERa-ENUssC7a5oj64YsOVt1EsGke9EwNoi-UoFfhJT5CxDIvlkYPnBG2hPxDOAnyJZNvqw4J9r2moSsZK7EK_pViPdB-SVPMnOh4uS-3lGRohFE2k6euILgcMkYlKhMoVHg34d03WpLJ78wj7KTBpfp6D25SDSaaZ-nPBFbBPNYK-1J_GdUotyDZnkLV1jckJY6VgAScSwk_IQD4ZZQGz6DUmKLqF-MF76xn6U4_7koYH" },
  { name: "Cats",       href: "/marketplace?category=cats",       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-2dr4axG5LdAQme_h1Sueo6Mzok2bfUdtLCbJGsvGKPALuz50CtPMMZ3gQZWtUED5_VznzI6hOWp7Ff8ttNWOtV5ht9MDpXIljoQ2JMWvvfkT_o8apC4bwaqHm6JgNs9LZBTc5llKNPU_vrLzUYI1R0JrhUcPRuuzE6X0FTn8LQdhMh1cLx8k8DV8rCJj9FqnpSPqgc2ed5GcjYOJayjcXUqG6RRc-mX4iMKSjqyiGQoq_gvqxCT3vgTO18Z8T129b2QWRIQMlWUc" },
  { name: "Birds",      href: "/marketplace?category=birds",      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNk_H_qETyoPl4kXFckjk8ocHSQKKWX1TQ7-YoZO3x-yXNJ2DTdJq4_9-JcjMf5B-FZT55W2KUV8k0RlBhqvFpYJFqsQZ2_XXsYgfb4QubspcpY7rAmf2FADYduwo2CtDH5oW9KdFv_teEWRCr3whDtgFa0n2RR39yrEc1Jtb00rEzsOUPYXrYbjtTFTT2vAr1x7le5J10u-PyVStFfP0e6Z-BOSV7tFRsxc7o9q1BM2DMbQJfNlV4Nbyr9bjbmoUohgAAgg7EEumZ" },
  { name: "Fish",       href: "/marketplace?category=fish",       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVJ6sCFW8hn29kwdU0TLsD_R6o3Ei_Sz5Uc3I28CKwxOHXqd_eb-Z5Gh4PGQxnHPaKeOfO9MSPd_FsPK7UyjVJFzziI5CddU9MQTo7eILIf5ZMFIMGTJIYqV5CA5iuW4t-4giBbRbdt-3UYRUPiE35TRu5g8dKX3VyKEfBGPAGVAbto9feqTYugtPdmSt39a5i20aSE___K2XODwyW1_DtE-GTSfPYuRmtEh9U9M6Ga0DSd0DU5N_nJIN1wIJykgdQoKXhOqWKXmzT" },
  { name: "Small Pets", href: "/marketplace?category=small_pets", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3LbEBvB903zjSUXfw4kM9Z1UaaUXgTuSxRhPLASfj1ItCElirDtlTT7zu1BgZlZnYByyRNeaFfLiK3Q9j8W3B2hJe9DhS7wyfrHPP2atdQqIJRH79gCJc-z5b3r9QlG12QWfMYeZErI0rOVfa5M4Q89iZz1e8EMxSSoYc4zoHCk8CgBV10pYaTZyHTsdoRY1MHyy-eGNAwpGEuy72Jd-uddJ8DvvrGjyWBW-cKYBBgI0bwcgmSQBPTMa9CoETFCE2mVEpLjELB5l" },
];

export default function ShopByPet() {
  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">
      <div className="text-center mb-4">
        <h2 className="text-sm font-bold text-on-surface">Shop by Pet</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">Find the perfect products for your companion</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {PETS.map(({ name, href, image }) => (
          <Link key={name} href={href} className="group flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-outline-variant/30 group-hover:border-primary group-hover:shadow-md transition-all duration-300">
              <img
                alt={name}
                src={image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <p className="text-xs font-semibold text-center text-on-surface group-hover:text-primary transition-colors">{name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
