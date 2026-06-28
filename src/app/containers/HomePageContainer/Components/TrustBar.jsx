"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { IconMedical, IconEco, IconSupport, IconShipping, IconShield, IconGift } from "@/lib/icons";

const ICON_MAP = {
  shipping: IconShipping,
  shield:   IconShield,
  medical:  IconMedical,
  gift:     IconGift,
  eco:      IconEco,
  support:  IconSupport,
};

export default function TrustBar() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/settings")
      .then(data => setItems(data.settings?.trustItems ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !items.length) return null;

  return (
    <section className="bg-surface border-y border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full animate-shimmer shrink-0" />
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="h-2.5 w-3/4 rounded-full animate-shimmer" />
                    <div className="h-2 w-full rounded-full animate-shimmer" />
                  </div>
                </div>
              ))
            : items.map(({ iconName, title, sub }) => {
                const Icon = ICON_MAP[iconName] ?? IconShield;
                return (
                  <div
                    key={title}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-primary" weight="regular" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-on-surface truncate">{title}</p>
                      <p className="text-[9px] text-on-surface-variant leading-tight truncate">{sub}</p>
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
