"use client";

import Link from "next/link";
import {
  IconBowlFood,
  IconGameController,
  IconPill,
  IconGroom,
  IconBed,
  IconTag,
  IconFish,
  IconBird,
} from "@/lib/icons";

const CATEGORIES = [
  {
    label:  "Food & Treats",
    Icon:   IconBowlFood,
    href:   "/marketplace?type=food",
    bg:     "#FFF3E0",
    iconBg: "#FF9800",
    text:   "#BF360C",
    count:  "240+ items",
  },
  {
    label:  "Toys & Play",
    Icon:   IconGameController,
    href:   "/marketplace?type=toy",
    bg:     "#FFF8E1",
    iconBg: "#FFC107",
    text:   "#E65100",
    count:  "130+ items",
  },
  {
    label:  "Health & Pharma",
    Icon:   IconPill,
    href:   "/marketplace?type=health",
    bg:     "#E8F5E9",
    iconBg: "#43A047",
    text:   "#1B5E20",
    count:  "180+ items",
  },
  {
    label:  "Grooming",
    Icon:   IconGroom,
    href:   "/marketplace?type=grooming",
    bg:     "#FCE4EC",
    iconBg: "#E91E63",
    text:   "#880E4F",
    count:  "90+ items",
  },
  {
    label:  "Beds & Houses",
    Icon:   IconBed,
    href:   "/marketplace?type=beds",
    bg:     "#E3F2FD",
    iconBg: "#1E88E5",
    text:   "#0D47A1",
    count:  "70+ items",
  },
  {
    label:  "Accessories",
    Icon:   IconTag,
    href:   "/marketplace?type=accessories",
    bg:     "#F3E5F5",
    iconBg: "#8E24AA",
    text:   "#4A148C",
    count:  "320+ items",
  },
  {
    label:  "Aquatics",
    Icon:   IconFish,
    href:   "/marketplace?category=fish",
    bg:     "#E0F7FA",
    iconBg: "#00ACC1",
    text:   "#006064",
    count:  "60+ items",
  },
  {
    label:  "Birds & Exotics",
    Icon:   IconBird,
    href:   "/marketplace?category=birds",
    bg:     "#F1F8E9",
    iconBg: "#7CB342",
    text:   "#33691E",
    count:  "45+ items",
  },
];

export default function ShopByCategoryGrid() {
  return (
    <section className="w-full bg-white border-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-sm font-bold text-on-surface">Shop by Category</h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Everything your pet needs, all in one place
            </p>
          </div>
          <Link href="/marketplace" className="text-xs font-bold text-primary hover:underline hidden sm:block">
            See all →
          </Link>
        </div>

        {/* Grid — 4 cols mobile, 8 cols desktop */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
          {CATEGORIES.map(({ label, Icon, href, bg, iconBg, text, count }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-2.5"
            >
              {/* Icon circle */}
              <div
                className="w-full aspect-square max-w-[84px] mx-auto rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl"
                style={{ background: bg }}
              >
                <div
                  className="w-[56%] h-[56%] rounded-full flex items-center justify-center"
                  style={{ background: iconBg }}
                >
                  <Icon size={22} weight="fill" className="text-white" />
                </div>
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className="text-[10px] md:text-[11px] font-black leading-tight"
                  style={{ color: text }}
                >
                  {label}
                </p>
                <p className="text-[8px] md:text-[9px] text-on-surface-variant mt-0.5">
                  {count}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "see all" */}
        <div className="flex justify-center mt-6 sm:hidden">
          <Link
            href="/marketplace"
            className="text-xs font-bold text-primary border border-primary/30 px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            See all categories →
          </Link>
        </div>

      </div>
    </section>
  );
}
