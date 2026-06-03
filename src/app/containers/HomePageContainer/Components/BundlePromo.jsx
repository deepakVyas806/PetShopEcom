"use client";

import { useStore } from "@/context/StoreContext";

const BUNDLE_ITEMS = [
  "Artisan Ceramic Bowl",
  "Organic Kibble (2 kg)",
  "Minimalist Rope Leash",
];

export default function BundlePromo() {
  const { addToCart, products } = useStore();

  const handleAddBundle = () => {
    // Add first 3 store products as a bundle approximation
    products.slice(0, 3).forEach((p) => addToCart(p));
  };

  return (
    <section className="bg-primary/5 py-6">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col lg:flex-row shadow-sm">

          {/* Image */}
          <div className="lg:w-2/5 relative h-56 lg:h-auto flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBB2EamYQkMxtsTC5rWmpPHITfS0vRxBjsQ7PoJAxakX8M-wNUFFieN--LKFnqn_MocaHTxA3cLPTM4k1YuOFodxHzcEJEf27y8LVUj7HKLqxYp3_QMGQvH4mGKRzxTz8-XwF7FrKfkoig7DBXohBYMnmDkvrmiqj-SpulYeo63S6U_LINkKfeTg29p46w0S5bIuGtdBrCwCHF6P6mNBucT4WTtkXAPSH6TKdfYMMd__a2OTLVtUWK5A4CU-Pegt9riLzzkKlYk8TS"
              alt="Essentials Starter Kit Bundle"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
            <div>
              <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                Featured Bundle
              </span>
              <h2 className="text-sm font-bold text-on-surface">Essentials Starter Kit</h2>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Everything your new companion needs to feel right at home.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-on-surface mb-2">Bundle Contents:</p>
              <ul className="space-y-1.5">
                {BUNDLE_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="text-xs text-on-surface-variant line-through">$100.00</span>
                <span className="text-base font-extrabold text-primary">$85.00</span>
              </div>
              <span className="bg-error-container text-on-error-container px-2.5 py-1 rounded-lg text-xs font-bold">
                Save $15.00
              </span>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-fit bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary py-2.5 px-5 rounded-full text-xs font-semibold hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>add_shopping_cart</span>
              Add Bundle to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
