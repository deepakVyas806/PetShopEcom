"use client";
import { memo, useState } from "react";
import { IconClose, IconCheck } from "@/lib/icons";
import { STATUS_OPTIONS, STATUS_STYLES } from "../data";

const ALL_STATUSES = STATUS_OPTIONS.filter((s) => s !== "All Statuses");

export default memo(function StatusUpdateModal({ order, onConfirm, onClose }) {
  const [selected, setSelected] = useState(order.status);
  const unchanged = selected === order.status;

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
          <div>
            <h3 className="text-xs font-bold text-on-surface">Update Order Status</h3>
            <p className="text-[10px] text-on-surface-variant font-mono">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-full cursor-pointer transition-all"
          >
            <IconClose size={15} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Status list */}
        <div className="px-4 py-3 space-y-1.5 max-h-72 overflow-y-auto">
          {ALL_STATUSES.map((status) => {
            const s = STATUS_STYLES[status] ?? {};
            const isSelected = selected === status;
            return (
              <button
                key={status}
                onClick={() => setSelected(status)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant/30 hover:bg-surface-container-low"
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot ?? "bg-gray-400"}`} />
                <span className="text-xs font-medium text-on-surface flex-1">{status}</span>
                {isSelected && <IconCheck size={13} className="text-primary flex-shrink-0" weight="bold" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-outline-variant/30 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-outline-variant rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(order.id, selected)}
            disabled={unchanged}
            className="flex-1 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
});
