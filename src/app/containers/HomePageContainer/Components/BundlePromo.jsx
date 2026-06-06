"use client";

import { useStore } from "@/context/StoreContext";
import { fmt } from "@/lib/currency";
import { IconCheckCircle, IconCartSimple } from "@/lib/icons";

const BUNDLE_ITEMS = [
  "Artisan Ceramic Bowl",
  "Organic Kibble (2 kg)",
  "Minimalist Rope Leash",
];

export default function BundlePromo() {
  const { addToCart, products } = useStore();

  const handleAddBundle = () => {
    products.slice(0, 3).forEach((p) => addToCart(p));
  };

  return (
    <section className="bg-primary/5 py-5">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        <div className="text-center mb-4">
          <h2 className="text-sm font-bold text-on-surface">Featured Bundle</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Everything your new companion needs in one box</p>
        </div>

        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant/30 flex flex-col lg:flex-row shadow-sm">
          {/* Image */}
          <div className="lg:w-2/5 relative flex-shrink-0" style={{ aspectRatio: "16/9", minHeight: 160 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBB2EamYQkMxtsTC5rWmpPHITfS0vRxBjsQ7PoJAxakX8M-wNUFFieN--LKFnqn_MocaHTxA3cLPTM4k1YuOFodxHzcEJEf27y8LVUj7HKLqxYp3_QMGQvH4mGKRzxTz8-XwF7FrKfkoig7DBXohBYMnmDkvrmiqj-SpulYeo63S6U_LINkKfeTg29p46w0S5bIuGtdBrCwCHF6P6mNBucT4WTtkXAPSH6TKdfYMMd__a2OTLVtUWK5A4CU-Pegt9riLzzkKlYk8TS"
              alt="Essentials Starter Kit Bundle"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-center space-y-3">
            <div>
              <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5">
                Save {fmt(15)}
              </span>
              <h2 className="text-sm font-bold text-on-surface">Essentials Starter Kit</h2>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                Everything your new companion needs to feel right at home.
              </p>
            </div>

            <ul className="space-y-1">
              {BUNDLE_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <IconCheckCircle size={13} className="text-primary" weight="regular" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="text-xs text-on-surface-variant line-through">{fmt(100)}</span>
                <span className="text-sm font-extrabold text-primary">{fmt(85)}</span>
              </div>
              <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-lg text-[10px] font-bold">
                Save {fmt(15)}
              </span>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-fit bg-primary text-on-primary hover:brightness-105 py-2 px-4 rounded-full text-xs font-semibold hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 border-none cursor-pointer"
            >
              <IconCartSimple size={14} className="leading-none" weight="bold" />
              Add Bundle to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
