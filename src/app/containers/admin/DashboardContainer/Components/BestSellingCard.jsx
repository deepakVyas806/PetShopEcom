import { memo } from "react";
import { Card } from "@/components/ui";
import { IconDownload, IconShare } from "@/lib/icons";
import { BEST_SELLER } from "../data";

export default memo(function BestSellingCard() {
  return (
    <Card padding="lg" className="bg-gradient-to-br from-white to-primary/5">
      <h3 className="text-xs font-bold text-on-surface mb-4">Best Selling Category</h3>

      {/* Hero image */}
      <div className="relative overflow-hidden rounded-xl aspect-video group mb-4">
        <img
          src={BEST_SELLER.image}
          alt={BEST_SELLER.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-3">
          <p className="text-[9px] text-white/80 font-bold uppercase tracking-widest">Top Performer</p>
          <h4 className="text-xs font-bold text-white">{BEST_SELLER.name}</h4>
          <p className="text-[10px] text-white/80">Revenue: {BEST_SELLER.revenue} this month</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: IconDownload, label: "Export CSV" },
          { icon: IconShare,    label: "Share Report" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-surface rounded-xl border border-outline-variant hover:border-primary hover:text-primary transition-all text-xs font-semibold text-on-surface cursor-pointer"
          >
            <Icon size={14} weight="bold" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
});
