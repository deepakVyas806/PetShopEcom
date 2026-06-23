"use client";

const REVIEWS = [
  {
    text:   "The quality of the organic food is unmatched. Cooper's coat has never looked better! Truly premium care.",
    name:   "Sarah M.",
    pet:    "Golden Retriever Owner",
    avatar: "S",
    rating: 5,
    date:   "3 days ago",
    bg:     "bg-orange-100 dark:bg-orange-900/30",
    fg:     "text-orange-700 dark:text-orange-300",
    verified: true,
  },
  {
    text:   "The Traveler Luxe carrier is worth every penny. Luna feels secure and stylish during our trips together.",
    name:   "Mark R.",
    pet:    "Ragdoll Cat Owner",
    avatar: "M",
    rating: 5,
    date:   "1 week ago",
    bg:     "bg-purple-100 dark:bg-purple-900/30",
    fg:     "text-purple-700 dark:text-purple-300",
    verified: true,
  },
  {
    text:   "A pet shop that cares about design as much as functionality. I love their curated artisan selection!",
    name:   "Elena K.",
    pet:    "Hamster Parent",
    avatar: "E",
    rating: 5,
    date:   "2 weeks ago",
    bg:     "bg-pink-100 dark:bg-pink-900/30",
    fg:     "text-pink-700 dark:text-pink-300",
    verified: false,
  },
  {
    text:   "Fast shipping, beautiful packaging, and my dog absolutely loves the organic treats. Five stars always.",
    name:   "James T.",
    pet:    "Beagle Owner",
    avatar: "J",
    rating: 5,
    date:   "3 weeks ago",
    bg:     "bg-green-100 dark:bg-green-900/30",
    fg:     "text-green-700 dark:text-green-300",
    verified: true,
  },
];

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"} style={{ fontSize: 12 }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-6 bg-background">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-on-surface">What Pet Parents Say</h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Trusted by 10,000+ happy pet families</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 px-3 py-1.5 rounded-full">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">4.8 / 5</span>
            <span className="text-[10px] text-on-surface-variant">· 2,400+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REVIEWS.map(({ text, name, pet, avatar, rating, date, bg, fg, verified }) => (
            <div
              key={name}
              className="bg-white dark:bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow"
            >
              {/* Stars + date */}
              <div className="flex items-center justify-between">
                <StarRow rating={rating} />
                <span className="text-[9px] text-on-surface-variant">{date}</span>
              </div>

              {/* Review text */}
              <p className="text-xs text-on-surface-variant leading-relaxed flex-1">
                "{text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-outline-variant/10">
                <div className={`w-8 h-8 rounded-full ${bg} ${fg} flex items-center justify-center text-xs font-bold shrink-0`}>
                  {avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold text-on-surface truncate">{name}</p>
                    {verified && (
                      <span className="text-[8px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1 py-0.5 rounded font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-[9px] text-on-surface-variant truncate">{pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
