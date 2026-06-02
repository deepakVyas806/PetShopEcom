import React from "react";
import { siteConfig } from "@/config/site";
import { Hexagon, PawPrint } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
}

export default function BrandLogo({
  className = "",
  showText = true,
}: BrandLogoProps) {
  const isKinetic = siteConfig.themeType === "kinetic";

  if (isKinetic) {
    return (
      <div className={`flex items-center gap-2 select-none text-left ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow">
          <Hexagon className="w-4 h-4 text-brand-secondary fill-brand-secondary/10 animate-pulse" />
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-brand-foreground">
              {siteConfig.name}
            </span>
            <span className="text-[8px] uppercase font-extrabold tracking-widest text-[#d4af37] leading-none mt-0.5">
              Clinical PetTech
            </span>
          </div>
        )}
      </div>
    );
  }

  // Premium mass-market logo style with a paw print in a purple gradient circle.
  return (
    <div className={`flex items-center gap-2.5 select-none py-1 text-left ${className}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary flex items-center justify-center text-white shadow-lg shadow-purple-950/40 shrink-0">
        <PawPrint className="w-4.5 h-4.5 text-white" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-base font-black tracking-tight text-current leading-none">
            art<span className="text-brand-primary font-black">petshop</span>
          </span>
          <span className="text-[8.5px] uppercase font-extrabold tracking-widest text-brand-secondary leading-none mt-1">
            Premium Care
          </span>
        </div>
      )}
    </div>
  );

}
