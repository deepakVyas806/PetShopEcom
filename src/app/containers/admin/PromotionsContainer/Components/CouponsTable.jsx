"use client";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { IconMoreVert, IconEdit, IconDelete, IconCopy, IconCheck, IconClose } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import { STATUS_META, discountLabel } from "../data";

const FILTER_TABS = [
  { key: "all",       label: "All"       },
  { key: "active",    label: "Active"    },
  { key: "scheduled", label: "Scheduled" },
  { key: "paused",    label: "Paused"    },
  { key: "expired",   label: "Expired"   },
];

function RowMenu({ coupon, onEdit, onToggle, onDuplicate, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const canToggle = coupon.status === "active" || coupon.status === "paused";

  return (
    <div
      ref={ref}
      className="absolute right-4 top-10 z-[55] w-44 bg-surface rounded-xl border border-outline-variant/40 shadow-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => { onEdit(coupon); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-medium text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer text-left"
      >
        <IconEdit size={13} weight="regular" /> Edit Coupon
      </button>
      {canToggle && (
        <button
          type="button"
          onClick={() => { onToggle(coupon.id); onClose(); }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-medium text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer text-left"
        >
          {coupon.status === "active"
            ? <><IconClose size={13} weight="regular" /> Pause</>
            : <><IconCheck size={13} weight="regular" /> Activate</>
          }
        </button>
      )}
      <button
        type="button"
        onClick={() => { onDuplicate(coupon); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-medium text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer text-left"
      >
        <IconCopy size={13} weight="regular" /> Duplicate
      </button>
      <div className="h-px bg-outline-variant/30 mx-3" />
      <button
        type="button"
        onClick={() => { onDelete(coupon); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-medium text-error hover:bg-error/5 transition-colors cursor-pointer text-left"
      >
        <IconDelete size={13} weight="regular" /> Delete
      </button>
    </div>
  );
}

const CouponsTable = memo(function CouponsTable({
  coupons,
  onEdit,
  onToggle,
  onDuplicate,
  onDelete,
}) {
  const [filter,  setFilter]  = useState("all");
  const [menuId,  setMenuId]  = useState(null);

  const filtered = coupons.filter((c) => filter === "all" || c.status === filter);

  const closeMenu = useCallback(() => setMenuId(null), []);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-outline-variant/30 flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-xs font-bold text-on-surface">Active Promotions</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 border border-outline-variant text-[10px] font-bold text-on-surface-variant rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Filter
          </button>
          <button
            type="button"
            className="px-3 py-1.5 border border-outline-variant text-[10px] font-bold text-on-surface-variant rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-5 py-2.5 flex gap-1.5 border-b border-outline-variant/20 overflow-x-auto">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
              <th className="text-left px-5 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Coupon Details</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Discount</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Usage</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Revenue</th>
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[10px] text-on-surface-variant">
                  No coupons match this filter.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const s = STATUS_META[c.status] ?? STATUS_META.expired;
                const isMenuOpen = menuId === c.id;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-surface-container-low/40 transition-colors group relative"
                  >
                    {/* Coupon details */}
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-primary font-mono">{c.code}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{c.description}</p>
                      {c.usageLimit > 0 && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-on-surface-variant">{c.usageCount}/{c.usageLimit}</span>
                        </div>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-on-surface">{discountLabel(c)}</span>
                      {c.minOrderRaw > 0 && (
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          Min. {fmt(c.minOrderRaw)}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.bg} ${s.text} ${s.border}`}
                      >
                        {s.label}
                      </span>
                    </td>

                    {/* Usage */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-xs font-semibold text-on-surface">{c.usageCount.toLocaleString("en-IN")}</span>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-xs font-bold text-on-surface">
                        {c.revenueRaw > 0 ? fmt(c.revenueRaw) : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 relative">
                      <button
                        type="button"
                        onClick={() => setMenuId(isMenuOpen ? null : c.id)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
                      >
                        <IconMoreVert size={15} weight="regular" />
                      </button>

                      {isMenuOpen && (
                        <RowMenu
                          coupon={c}
                          onEdit={onEdit}
                          onToggle={onToggle}
                          onDuplicate={onDuplicate}
                          onDelete={onDelete}
                          onClose={closeMenu}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-outline-variant/20">
        <p className="text-[10px] text-on-surface-variant">
          {filtered.length} coupon{filtered.length !== 1 ? "s" : ""} shown
        </p>
      </div>
    </div>
  );
});

export default CouponsTable;
