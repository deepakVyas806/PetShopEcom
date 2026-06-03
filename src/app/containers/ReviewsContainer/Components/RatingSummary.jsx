"use client";

import { useState, useEffect } from "react";

const glassCard = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid #F3E8FF",
};


function RatingBar({ star, pct, animated }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-on-surface-variant w-11 flex-shrink-0">{star} Star</span>
      <div className="flex-1 h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-container rounded-full"
          style={{
            width: animated ? `${pct}%` : "0%",
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <span className="text-xs text-on-surface-variant w-7 text-right flex-shrink-0">{pct}%</span>
    </div>
  );
}

export default function RatingSummary({ product }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="p-4 rounded-xl sticky top-24 space-y-4" style={glassCard}>
      <h2 className="text-sm font-bold text-on-surface">Customer Reviews</h2>

      {/* Star distribution */}
      <div className="space-y-2.5">
        {product.ratingDistribution.map(({ star, pct }) => (
          <RatingBar key={star} star={star} pct={pct} animated={animated} />
        ))}
      </div>

      {/* Write a review */}
      <div className="border-t border-outline-variant/30 pt-4 space-y-2">
        <p className="text-xs font-semibold text-on-surface">Review this product</p>
        <p className="text-xs text-on-surface-variant">Share your thoughts with other pet owners</p>
        <button
          className="w-full py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}
