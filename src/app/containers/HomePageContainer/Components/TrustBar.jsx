"use client";

const ITEMS = [
  { icon: "medical_services", label: "Vet-Approved Nutrition" },
  { icon: "eco",              label: "Eco-Friendly Packaging" },
  { icon: "support_agent",   label: "24/7 Expert Support"    },
  { icon: "local_shipping",  label: "Free Shipping on $50+"  },
];

export default function TrustBar() {
  return (
    <section className="bg-surface-container-low py-3 border-b border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {ITEMS.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>
                {icon}
              </span>
              <span className="text-xs font-medium text-on-surface">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
