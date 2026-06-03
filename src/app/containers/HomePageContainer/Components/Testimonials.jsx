"use client";

const REVIEWS = [
  {
    text:   "The quality of the organic food is unmatched. Cooper's coat has never looked better! Truly premium care.",
    name:   "Sarah & Cooper",
    pet:    "Golden Retriever",
    avatar: "S",
  },
  {
    text:   "The Traveler Luxe carrier is worth every penny. Beautiful design and Luna feels so secure and stylish during our trips.",
    name:   "Mark & Luna",
    pet:    "Ragdoll Cat",
    avatar: "M",
  },
  {
    text:   "Finally a pet shop that cares as much about design as functionality. I love their curated selection of artisan goods.",
    name:   "Elena & Pip",
    pet:    "Hamster",
    avatar: "E",
  },
  {
    text:   "Fast shipping, beautiful packaging, and my dog absolutely loves the organic treats. Five stars every time.",
    name:   "James & Biscuit",
    pet:    "Beagle",
    avatar: "J",
  },
];

function StarRow() {
  return (
    <div className="flex text-primary mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="material-symbols-outlined leading-none" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-6 bg-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="text-center mb-4">
          <h2 className="text-sm font-bold text-on-surface">Happy Tails</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Hear from our community of modern pet parents
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
          {REVIEWS.map(({ text, name, pet, avatar }) => (
            <div
              key={name}
              className="flex-none w-72 md:w-80 snap-center bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 flex flex-col"
            >
              <StarRow />
              <p className="text-xs text-on-surface-variant italic leading-relaxed flex-1 mb-4">
                "{text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">{name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                    {pet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
