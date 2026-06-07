"use client";
import { memo } from "react";
import { IconClose, IconDelete, IconWarning } from "@/lib/icons";

export default memo(function DeleteConfirmModal({ product, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-outline-variant/30">
          <h3 className="text-xs font-bold text-on-surface">Delete Product</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full cursor-pointer transition-all">
            <IconClose size={15} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-5 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
            <IconWarning size={22} className="text-error" weight="fill" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">{product.name}</p>
            <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
              This will permanently remove the product from your inventory. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-outline-variant rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-error text-on-error rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <IconDelete size={13} weight="bold" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
});
