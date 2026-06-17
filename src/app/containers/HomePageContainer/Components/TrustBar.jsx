"use client";

import { IconMedical, IconEco, IconSupport, IconShipping, IconShield, IconGift } from "@/lib/icons";

const ITEMS = [
  { Icon: IconShipping, title: "Free Delivery",      sub: "On orders above ₹499"        },
  { Icon: IconShield,   title: "100% Genuine",        sub: "Vet-approved products"        },
  { Icon: IconMedical,  title: "Expert Support",      sub: "24/7 pet care guidance"       },
  { Icon: IconGift,     title: "Easy Returns",        sub: "7-day hassle-free policy"     },
  { Icon: IconEco,      title: "Eco-Friendly",        sub: "Sustainable packaging"        },
  { Icon: IconSupport,  title: "Live Chat",           sub: "Talk to a pet expert now"     },
];

export default function TrustBar() {
  return (
    <section className="bg-surface border-y border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ITEMS.map(({ Icon, title, sub }) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
