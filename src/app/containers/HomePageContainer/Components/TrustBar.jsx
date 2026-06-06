"use client";

import { IconMedical, IconEco, IconSupport, IconShipping } from "@/lib/icons";

const ITEMS = [
  { Icon: IconMedical,  label: "Vet-Approved Nutrition" },
  { Icon: IconEco,      label: "Eco-Friendly Packaging" },
  { Icon: IconSupport,  label: "24/7 Expert Support"    },
  { Icon: IconShipping, label: "Free Shipping on $50+"  },
];

export default function TrustBar() {
  return (
    <section className="bg-surface-container-low py-2.5 border-b border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {ITEMS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center justify-center sm:justify-start gap-2">
              <Icon size={16} className="text-primary shrink-0" weight="regular" />
              <span className="text-xs font-medium text-on-surface">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
