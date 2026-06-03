"use client";

import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all",        icon: "notifications",  label: "All Notifications" },
  { key: "orders",     icon: "local_shipping", label: "Orders"            },
  { key: "promotions", icon: "sell",           label: "Promotions"        },
  { key: "account",    icon: "account_circle", label: "Account"           },
];

export default function NotificationsFilter({ activeFilter, onFilter }) {
  return (
    <aside className="w-full lg:w-56 shrink-0">
      {/* Category buttons */}
      <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-3 lg:pb-0 no-scrollbar">
        {FILTERS.map(({ key, icon, label }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => onFilter(key)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-left transition-all cursor-pointer border-none text-xs font-medium whitespace-nowrap",
                isActive
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <span
                className="material-symbols-outlined leading-none flex-shrink-0"
                style={{ fontSize: 16 }}
              >
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {/* ArtRewards promo card — desktop only */}
      <div className="hidden lg:block mt-5 p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <h4 className="text-xs font-bold text-primary mb-1">Join ArtRewards</h4>
        <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
          Earn paw-points for every notification you engage with.
        </p>
        <button className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:shadow-md transition-all cursor-pointer border-none">
          Learn More
        </button>
      </div>
    </aside>
  );
}
