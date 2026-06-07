"use client";
import { memo } from "react";
import { IconEdit, IconDelete, IconClose, IconGrid } from "@/lib/icons";

export default memo(function BulkActionBar({ count, onBulkDelete, onBulkCategory, onClose }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-[60] border border-white/10 transition-all duration-300 ${
        count > 0 ? "translate-y-0 opacity-100" : "translate-y-28 opacity-0 pointer-events-none"
      }`}
    >
      {/* Count badge */}
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
          {count > 9 ? "9+" : count}
        </span>
        <p className="text-xs font-medium whitespace-nowrap">{count} selected</p>
      </div>

      <div className="h-5 w-px bg-white/15 flex-shrink-0" />

      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={onBulkCategory}
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-xs font-medium whitespace-nowrap"
        >
          <IconGrid size={13} weight="bold" />
          Update Category
        </button>
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-xs font-medium text-error whitespace-nowrap"
        >
          <IconDelete size={13} weight="bold" />
          Delete All
        </button>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer flex-shrink-0"
      >
        <IconClose size={14} />
      </button>
    </div>
  );
});
