"use client";
import { memo, useEffect, useRef } from "react";
import { IconEdit, IconStar, IconCalendar, IconDelete } from "@/lib/icons";

const MENU_ITEMS = [
  { action: "edit",              label: "Edit Service",        icon: IconEdit,     danger: false },
  { action: "toggleFeatured",   label: "Toggle Featured",     icon: IconStar,     danger: false },
  { action: "toggleAvailability", label: "Toggle Availability", icon: IconCalendar, danger: false },
  { action: "delete",           label: "Delete Service",      icon: IconDelete,   danger: true  },
];

export default memo(function ServiceRowMenu({ service, onAction, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-9 w-48 bg-surface rounded-xl shadow-xl border border-outline-variant/30 py-1.5 z-50 overflow-hidden"
    >
      {MENU_ITEMS.map(({ action, label, icon: Icon, danger }) => (
        <button
          key={action}
          type="button"
          onClick={() => onAction(action)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
            danger
              ? "text-error hover:bg-error/10"
              : "text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <Icon
            size={14}
            weight="bold"
            className={danger ? "text-error" : "text-on-surface-variant"}
          />
          {label}
        </button>
      ))}
    </div>
  );
});
