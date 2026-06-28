"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const BG_PALETTE = [
  { bg: "bg-orange-100 dark:bg-orange-900/30", fg: "text-orange-700 dark:text-orange-300" },
  { bg: "bg-purple-100 dark:bg-purple-900/30", fg: "text-purple-700 dark:text-purple-300" },
  { bg: "bg-pink-100 dark:bg-pink-900/30",     fg: "text-pink-700 dark:text-pink-300"     },
  { bg: "bg-green-100 dark:bg-green-900/30",   fg: "text-green-700 dark:text-green-300"   },
];

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-on-surface-variant/30"} style={{ fontSize: 12 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded-full animate-shimmer" />
        <div className="h-2.5 w-14 rounded-full animate-shimmer" />
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-2.5 w-full rounded-full animate-shimmer" />
        <div className="h-2.5 w-5/6 rounded-full animate-shimmer" />
        <div className="h-2.5 w-4/5 rounded-full animate-shimmer" />
      </div>
      <div className="flex items-center gap-2.5 pt-2 border-t border-outline-variant/10">
        <div className="w-8 h-8 rounded-full animate-shimmer shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="h-2.5 w-20 rounded-full animate-shimmer" />
          <div className="h-2 w-16 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [reviews,       setReviews]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [totalCount,    setTotalCount]    = useState(0);

  useEffect(() => {
    api.get("/reviews/featured")
      .then(data => {
        setReviews(data.reviews ?? []);
        setAverageRating(data.averageRating ?? null);
        setTotalCount(data.totalCount ?? 0);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !reviews.length) return null;

  return (
    <section className="py-6 bg-background">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-on-surface">What Pet Parents Say</h2>
            {!loading && totalCount > 0 && (
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Based on {totalCount.toLocaleString()} verified reviews
              </p>
            )}
          </div>
          {!loading && averageRating !== null && (
            <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 px-3 py-1.5 rounded-full">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{averageRating.toFixed(1)} / 5</span>
              {totalCount > 0 && (
                <span className="text-[10px] text-on-surface-variant">· {totalCount.toLocaleString()}+ reviews</span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ReviewSkeleton key={i} />)
            : reviews.map((review, idx) => {
                const { bg, fg } = BG_PALETTE[idx % BG_PALETTE.length];
                const initial = (review.userName || review.name || "?")[0].toUpperCase();
                return (
                  <div
                    key={review._id ?? idx}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex flex-col gap-3 hover:shadow-card-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <StarRow rating={review.rating} />
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed flex-1">
                      "{review.comment || review.body}"
                    </p>
                    <div className="flex items-center gap-2.5 pt-2 border-t border-outline-variant/10">
                      <div className={`w-8 h-8 rounded-full ${bg} ${fg} flex items-center justify-center text-xs font-bold shrink-0`}>
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold text-on-surface truncate">{review.userName || review.name}</p>
                          {review.verified && (
                            <span className="text-[8px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1 py-0.5 rounded font-bold">✓</span>
                          )}
                        </div>
                        {review.petLabel && (
                          <p className="text-[9px] text-on-surface-variant truncate">{review.petLabel}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>
    </section>
  );
}
