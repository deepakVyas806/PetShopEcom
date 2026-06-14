import { memo } from "react";
import { Card, Sk } from "@/components/ui";
import { IconDownload, IconShare, IconPackage } from "@/lib/icons";
import { fmt } from "@/lib/currency";

export default memo(function BestSellingCard({ product, loading }) {
  const isInitial = loading && !product;

  return (
    <Card padding="lg" className="bg-gradient-to-br from-white to-primary/5">
      <h3 className="text-xs font-bold text-on-surface mb-4">Best Selling Product</h3>

      {isInitial ? (
        <div className="rounded-xl aspect-video bg-on-surface/8 animate-pulse mb-4" />
      ) : !product ? (
        <div className="rounded-xl aspect-video bg-surface-container-low flex flex-col items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
            <IconPackage size={18} className="text-on-surface-variant/40" weight="duotone" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant">No sales data yet</p>
          <p className="text-[10px] text-on-surface-variant/60">Top product will appear once orders are placed</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl aspect-video group mb-4">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-3">
            <p className="text-[9px] text-white/80 font-bold uppercase tracking-widest">Top Performer</p>
            <h4 className="text-xs font-bold text-white">{product.name}</h4>
            <p className="text-[10px] text-white/80">Revenue: {fmt(product.revenue ?? 0)} this month</p>
          </div>
        </div>
      )}

      {isInitial ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-xl bg-on-surface/8 animate-pulse" />
          <div className="h-9 rounded-xl bg-on-surface/8 animate-pulse" />
        </div>
      ) : (
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
      )}
    </Card>
  );
});
