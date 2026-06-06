"use client";

import { IconLocation } from "@/lib/icons";

export default function AddNewCard() {
  return (
    <button className="group w-full min-h-[180px] rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer bg-transparent p-6">
      {/* Circular icon */}
      <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-200">
        <IconLocation size={22} className="text-on-surface-variant group-hover:text-primary leading-none transition-colors" weight="regular" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
          Add New Address
        </p>
        <p className="text-xs text-outline mt-1 max-w-[180px] leading-relaxed">
          Save a new location for faster checkout.
        </p>
      </div>
    </button>
  );
}
