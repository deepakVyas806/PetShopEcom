"use client";
import { memo, useEffect, useRef } from "react";
import { IconEye, IconEdit, IconReceipt, IconCancel } from "@/lib/icons";

const MENU_ITEMS = [
  { label: "View Details",  icon: IconEye,     action: "view" },
  { label: "Update Status", icon: IconEdit,    action: "status" },
  { label: "Print Invoice", icon: IconReceipt, action: "print" },
  // { label: "Cancel Order",  icon: IconCancel,  action: "cancel", danger: true },
];

export default memo(function OrderRowMenu({ order, onAction, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 w-44 bg-surface rounded-xl shadow-lg border border-outline-variant/30 z-50 overflow-hidden py-1"
    >
      {MENU_ITEMS.map(({ label, icon: Icon, action, danger }) => (
        <button
          key={action}
          onClick={() => { onAction(action, order); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
            danger
              ? "text-error hover:bg-red-50"
              : "text-on-surface hover:bg-surface-container"
          }`}
        >
          <Icon size={14} weight="bold" />
          {label}
        </button>
      ))}
    </div>
  );
});
