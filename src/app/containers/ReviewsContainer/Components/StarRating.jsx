"use client";

import { IconStar, IconStarHalf } from "@/lib/icons";

export default function StarRating({ rating, size = 18 }) {
  return (
    <div className="flex text-primary">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half   = !filled && rating >= i - 0.5;
        return (
          <span key={i} className="leading-none">
            {half
              ? <IconStarHalf size={size} weight="fill" />
              : <IconStar size={size} weight={filled ? "fill" : "regular"} />
            }
          </span>
        );
      })}
    </div>
  );
}
