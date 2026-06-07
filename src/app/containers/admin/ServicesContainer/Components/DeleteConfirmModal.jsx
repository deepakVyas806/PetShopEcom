"use client";
import { memo, useEffect } from "react";
import { IconDelete, IconClose } from "@/lib/icons";

export default memo(function DeleteConfirmModal({ target, onConfirm, onCancel }) {
  if (!target) return null;

  const isBulk = target.type === "bulk";
  const title  = isBulk
    ? `Delete ${target.count} service${target.count !== 1 ? "s" : ""}?`
    : `Delete "${target.service.name}"?`;
  const body   = isBulk
    ? `All ${target.count} selected services will be permanently removed. This cannot be undone.`
    : "This service will be permanently removed and cannot be recovered.";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative bg-surface rounded-2xl w-full max-w-sm shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-error w-full" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
              <IconDelete size={20} className="text-error" weight="bold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-on-surface leading-snug">{title}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">{body}</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex-shrink-0"
            >
              <IconClose size={14} weight="bold" />
            </button>
          </div>

          {/* Warning note */}
          <div className="p-3 bg-error/5 border border-error/20 rounded-xl mb-4">
            <p className="text-[10px] text-error font-semibold">
              ⚠ This action cannot be undone.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-error text-on-error hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isBulk ? `Delete ${target.count} Services` : "Delete Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
