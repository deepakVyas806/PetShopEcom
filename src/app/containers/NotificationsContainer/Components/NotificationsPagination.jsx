"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NotificationsPagination({ total = 3 }) {
  const [current, setCurrent] = useState(1);

  return (
    <div className="pt-6 flex justify-center">
      <nav className="flex items-center gap-1.5">
        <button
          onClick={() => setCurrent((p) => Math.max(1, p - 1))}
          disabled={current === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary-fixed transition-colors disabled:opacity-40 cursor-pointer bg-transparent"
        >
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>chevron_left</span>
        </button>

        {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrent(page)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer border-none",
              current === page
                ? "bg-primary text-on-primary"
                : "border border-outline-variant hover:bg-primary-fixed bg-transparent"
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrent((p) => Math.min(total, p + 1))}
          disabled={current === total}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary-fixed transition-colors disabled:opacity-40 cursor-pointer bg-transparent"
        >
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
