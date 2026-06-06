"use client";

import { IconStar } from "@/lib/icons";

const REVIEWS = [
  {
    text:   "The quality of the organic food is unmatched. Cooper's coat has never looked better! Truly premium care.",
    name:   "Sarah",
    pet:    "Golden Retriever",
    avatar: "S",
    bg:     "bg-primary/10",
    fg:     "text-primary",
  },
  {
    text:   "The Traveler Luxe carrier is worth every penny. Luna feels so secure and stylish during our trips.",
    name:   "Mark",
    pet:    "Ragdoll Cat",
    avatar: "M",
    bg:     "bg-tertiary/10",
    fg:     "text-tertiary",
  },
  {
    text:   "A pet shop that cares as much about design as functionality. I love their curated artisan selection.",
    name:   "Elena",
    pet:    "Hamster",
    avatar: "E",
    bg:     "bg-secondary/10",
    fg:     "text-secondary",
  },
  {
    text:   "Fast shipping, beautiful packaging, and my dog absolutely loves the organic treats. Five stars always.",
    name:   "James",
    pet:    "Beagle",
    avatar: "J",
    bg:     "bg-primary/10",
    fg:     "text-primary",
  },
];

export default function Testimonials() {
  return (
    <section className="py-6 bg-surface-container-low border-y border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-sm font-bold text-on-surface">Happy Tails</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Hear from our community of modern pet parents
          </p>
        </div>

        {/* Grid — 2 cols on mobile, 4 on lg, no scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REVIEWS.map(({ text, name, pet, avatar, bg, fg }) => (
            <div
              key={name}
              className="bg-white/80 backdrop-blur-sm border border-[#F3E8FF] rounded-xl p-3.5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Quote mark + stars */}
              <div className="flex items-start justify-between">
                <span className={`text-2xl font-serif leading-none ${fg} opacity-40 select-none`}>"</span>
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <IconStar key={i} size={11} className="text-primary leading-none" weight="fill" />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-xs text-on-surface-variant leading-relaxed flex-1">
                {text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/15">
                <div className={`w-7 h-7 rounded-full ${bg} ${fg} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-on-surface truncate">{name}</p>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-medium truncate">{pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
