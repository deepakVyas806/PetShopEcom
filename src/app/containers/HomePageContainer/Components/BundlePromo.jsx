"use client";

import { useStore } from "@/context/StoreContext";
import { fmt } from "@/lib/currency";
import { IconCheckCircle, IconCartSimple, IconTag, IconClock } from "@/lib/icons";

const BUNDLE_ITEMS = [
  { icon: "🥣", label: "Artisan Ceramic Bowl",   detail: "Premium food-grade ceramic" },
  { icon: "🌿", label: "Organic Kibble (2 kg)",   detail: "Vet-approved nutrition"     },
  { icon: "🦮", label: "Minimalist Rope Leash",   detail: "Durable & stylish"          },
];

export default function BundlePromo() {
  const { addToCart, products } = useStore();

  const handleAddBundle = () => {
    products.slice(0, 3).forEach((p) => addToCart(p));
  };

  return (
    <section className="bg-background py-5">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

        <div
          className="rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-card-xl"
          style={{ background: "linear-gradient(135deg, #630ed4 0%, #7c3aed 60%, #9b59f5 100%)" }}
        >
          {/* Image side */}
          <div className="lg:w-2/5 relative shrink-0" style={{ aspectRatio: "16/9", minHeight: 180 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBB2EamYQkMxtsTC5rWmpPHITfS0vRxBjsQ7PoJAxakX8M-wNUFFieN--LKFnqn_MocaHTxA3cLPTM4k1YuOFodxHzcEJEf27y8LVUj7HKLqxYp3_QMGQvH4mGKRzxTz8-XwF7FrKfkoig7DBXohBYMnmDkvrmiqj-SpulYeo63S6U_LINkKfeTg29p46w0S5bIuGtdBrCwCHF6P6mNBucT4WTtkXAPSH6TKdfYMMd__a2OTLVtUWK5A4CU-Pegt9riLzzkKlYk8TS"
              alt="Essentials Starter Kit"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#630ed4]/40 to-transparent" />
            {/* Floating badge */}
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider shadow">
              Save 15%
            </div>
          </div>

          {/* Content side */}
          <div className="flex-1 p-5 flex flex-col justify-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/25">
                  ⭐ Featured Bundle
                </span>
                <span className="flex items-center gap-1 text-white/80 text-[9px]">
                  <IconClock size={10} weight="regular" />
                  Limited offer
                </span>
              </div>
              <h2 className="text-base md:text-lg font-extrabold text-white leading-tight">
                Essentials Starter Kit
              </h2>
              <p className="text-white/75 text-xs mt-1 leading-relaxed">
                Everything your new companion needs to feel right at home — curated and bundled.
              </p>
            </div>

            {/* Bundle items */}
            <ul className="space-y-2">
              {BUNDLE_ITEMS.map(({ icon, label, detail }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold leading-none">{label}</p>
                    <p className="text-white/60 text-[9px] mt-0.5">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Price + CTA */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex flex-col leading-none">
                <span className="text-white/60 text-[10px] line-through">{fmt(100)}</span>
                <span className="text-white text-xl font-black">{fmt(85)}</span>
                <span className="text-white/70 text-[9px] mt-0.5 flex items-center gap-1">
                  <IconTag size={10} weight="regular" />
                  You save {fmt(15)}
                </span>
              </div>

              <button
                onClick={handleAddBundle}
                className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 py-2.5 px-5 rounded-full text-xs font-extrabold shadow-card-md hover:shadow-card-lg transition-all active:scale-95 border-none cursor-pointer"
              >
                <IconCartSimple size={14} weight="bold" />
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
