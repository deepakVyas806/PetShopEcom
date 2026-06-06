"use client";

import { IconShield } from "@/lib/icons";

export default function SecurityBanner() {
  return (
    <div className="mt-5 p-5 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row gap-4 items-start">
      {/* Circular shield icon */}
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <IconShield size={18} className="text-on-primary" weight="bold" />
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-bold text-on-surface mb-1">Secure Payment Gateway</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          At artPetShop, your financial security is our top priority. We use 256-bit encryption
          and industry-leading standards to ensure your card details are never stored directly on
          our servers. All transactions are processed through PCI-compliant partners.
        </p>
        <button className="mt-3 text-xs text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none p-0">
          Learn more about our security practices
        </button>
      </div>
    </div>
  );
}
