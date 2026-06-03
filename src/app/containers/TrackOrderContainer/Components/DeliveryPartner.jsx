"use client";

export default function DeliveryPartner({ carrier }) {
  return (
    <section className="bg-tertiary-container text-on-tertiary-container rounded-xl p-4 border border-outline-variant/20 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">
              Delivery Partner
            </p>
            <h2 className="text-sm font-bold">{carrier}</h2>
          </div>
          <span
            className="material-symbols-outlined opacity-30"
            style={{ fontSize: 36 }}
          >
            pets
          </span>
        </div>

        <p className="text-xs leading-relaxed mb-4 opacity-80">
          "Handling your furry friend's supplies with extra love and speed."
        </p>

        <button className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity border-none cursor-pointer">
          Contact Support
        </button>
      </div>

      {/* Decorative glow */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </section>
  );
}
