"use client";

import { IconBell, IconShipping, IconTag, IconUser } from "@/lib/icons";

const FILTERS = [
  { key: "all",        Icon: IconBell,     label: "All" },
  { key: "orders",     Icon: IconShipping, label: "Orders" },
  { key: "promotions", Icon: IconTag,      label: "Promotions" },
  { key: "account",    Icon: IconUser,     label: "Account" },
];

export default function NotificationsFilter({ activeFilter, onFilter }) {
  return (
    <div
      className="flex gap-1 overflow-x-auto bg-surface-container-low rounded-xl p-1 border border-outline-variant/20"
      style={{ scrollbarWidth: "none" }}
    >
      {FILTERS.map(({ key, Icon, label }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => onFilter(key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none active:scale-95 cursor-pointer border-none outline-none flex-shrink-0 ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-white/60"
            }`}
          >
            <Icon size={13} weight="regular" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
