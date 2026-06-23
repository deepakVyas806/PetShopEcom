"use client";

import Link from "next/link";

const PETS = [
  {
    name: "Dogs",
    emoji: "🐕",
    href: "/marketplace?category=dogs",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhzSHTfxd_ce2WW2sI8D--QvAPX3wqmfBERa-ENUssC7a5oj64YsOVt1EsGke9EwNoi-UoFfhJT5CxDIvlkYPnBG2hPxDOAnyJZNvqw4J9r2moSsZK7EK_pViPdB-SVPMnOh4uS-3lGRohFE2k6euILgcMkYlKhMoVHg34d03WpLJ78wj7KTBpfp6D25SDSaaZ-nPBFbBPNYK-1J_GdUotyDZnkLV1jckJY6VgAScSwk_IQD4ZZQGz6DUmKLqF-MF76xn6U4_7koYH",
    subs: ["Food", "Toys", "Beds", "Grooming"],
    count: "142",
    accent: "border-orange-400",
    ring:   "ring-orange-400/30",
  },
  {
    name: "Cats",
    emoji: "🐱",
    href: "/marketplace?category=cats",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-2dr4axG5LdAQme_h1Sueo6Mzok2bfUdtLCbJGsvGKPALuz50CtPMMZ3gQZWtUED5_VznzI6hOWp7Ff8ttNWOtV5ht9MDpXIljoQ2JMWvvfkT_o8apC4bwaqHm6JgNs9LZBTc5llKNPU_vrLzUYI1R0JrhUcPRuuzE6X0FTn8LQdhMh1cLx8k8DV8rCJj9FqnpSPqgc2ed5GcjYOJayjcXUqG6RRc-mX4iMKSjqyiGQoq_gvqxCT3vgTO18Z8T129b2QWRIQMlWUc",
    subs: ["Food", "Toys", "Litter", "Scratchers"],
    count: "98",
    accent: "border-pink-400",
    ring:   "ring-pink-400/30",
  },
  {
    name: "Birds",
    emoji: "🦜",
    href: "/marketplace?category=birds",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNk_H_qETyoPl4kXFckjk8ocHSQKKWX1TQ7-YoZO3x-yXNJ2DTdJq4_9-JcjMf5B-FZT55W2KUV8k0RlBhqvFpYJFqsQZ2_XXsYgfb4QubspcpY7rAmf2FADYduwo2CtDH5oW9KdFv_teEWRCr3whDtgFa0n2RR39yrEc1Jtb00rEzsOUPYXrYbjtTFTT2vAr1x7le5J10u-PyVStFfP0e6Z-BOSV7tFRsxc7o9q1BM2DMbQJfNlV4Nbyr9bjbmoUohgAAgg7EEumZ",
    subs: ["Seed & Feed", "Cages", "Toys"],
    count: "45",
    accent: "border-emerald-400",
    ring:   "ring-emerald-400/30",
  },
  {
    name: "Fish",
    emoji: "🐠",
    href: "/marketplace?category=fish",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVJ6sCFW8hn29kwdU0TLsD_R6o3Ei_Sz5Uc3I28CKwxOHXqd_eb-Z5Gh4PGQxnHPaKeOfO9MSPd_FsPK7UyjVJFzziI5CddU9MQTo7eILIf5ZMFIMGTJIYqV5CA5iuW4t-4giBbRbdt-3UYRUPiE35TRu5g8dKX3VyKEfBGPAGVAbto9feqTYugtPdmSt39a5i20aSE___K2XODwyW1_DtE-GTSfPYuRmtEh9U9M6Ga0DSd0DU5N_nJIN1wIJykgdQoKXhOqWKXmzT",
    subs: ["Tanks", "Food", "Decorations"],
    count: "62",
    accent: "border-cyan-400",
    ring:   "ring-cyan-400/30",
  },
  {
    name: "Small Pets",
    emoji: "🐹",
    href: "/marketplace?category=small_pets",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3LbEBvB903zjSUXfw4kM9Z1UaaUXgTuSxRhPLASfj1ItCElirDtlTT7zu1BgZlZnYByyRNeaFfLiK3Q9j8W3B2hJe9DhS7wyfrHPP2atdQqIJRH79gCJc-z5b3r9QlG12QWfMYeZErI0rOVfa5M4Q89iZz1e8EMxSSoYc4zoHCk8CgBV10pYaTZyHTsdoRY1MHyy-eGNAwpGEuy72Jd-uddJ8DvvrGjyWBW-cKYBBgI0bwcgmSQBPTMa9CoETFCE2mVEpLjELB5l",
    subs: ["Hamsters", "Rabbits", "Guinea Pigs"],
    count: "38",
    accent: "border-violet-400",
    ring:   "ring-violet-400/30",
  },
];

export default function ShopByPet() {
  return (
    <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Shop by Pet</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Find the perfect products for your companion</p>
        </div>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 md:grid md:grid-cols-5 md:overflow-visible">
        {PETS.map(({ name, emoji, href, image, subs, count, accent, ring }) => (
          <Link
            key={name}
            href={href}
            className={`group shrink-0 w-36 md:w-auto flex flex-col items-center gap-2 cursor-pointer`}
          >
            {/* Circle image */}
            <div
              className={`w-full aspect-square rounded-full overflow-hidden border-4 ${accent} bg-gray-50
                group-hover:shadow-lg group-hover:ring-4 ${ring}
                transition-all duration-300`}
            >
              <img
                alt={name}
                src={image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Name + count */}
            <div className="text-center">
              <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                {emoji} {name}
              </p>
              <p className="text-[9px] text-on-surface-variant">{count}+ products</p>
            </div>

            {/* Sub-category chips */}
            <div className="flex flex-wrap justify-center gap-1 max-w-[140px]">
              {subs.slice(0, 3).map((sub) => (
                <span
                  key={sub}
                  className="text-[8px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full border border-outline-variant/20 group-hover:border-primary/30 group-hover:text-primary transition-colors"
                >
                  {sub}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
