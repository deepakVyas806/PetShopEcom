"use client";

export default function OrderSummaryCard({ subtotal, shippingCost, tax, total }) {
  return (
    <section className="bg-primary text-on-primary p-5 rounded-xl shadow-lg relative overflow-hidden">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <h2 className="text-xs font-bold mb-4 relative z-10">Order Summary</h2>

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-xs opacity-90">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs opacity-90">
          <span>Shipping</span>
          <span className="font-bold">
            {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-xs opacity-90">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="pt-3 border-t border-white/20 flex justify-between items-end">
          <span className="text-xs font-bold">Total</span>
          <span className="text-base font-extrabold">${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="w-full mt-4 py-2.5 px-4 bg-white text-primary rounded-xl text-xs font-bold hover:bg-white/90 transition-colors active:scale-[0.98] relative z-10 cursor-pointer border-none">
        Need help with this order?
      </button>
    </section>
  );
}
