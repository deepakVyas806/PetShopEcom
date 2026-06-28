"use client";
import { memo, useState } from "react";
import {
  IconEdit, IconEyeOff, IconDelete,
  IconChevronLeft, IconChevronRight, IconChevronDown,
  IconPackage, IconDownload, IconStar, IconMoreVert,
} from "@/lib/icons";
import ServiceRowMenu from "./ServiceRowMenu";
import { CATEGORY_STYLES, AVAILABILITY_OPTS, STAFF_AVATARS } from "../data";

// ── Internal ServiceRow ────────────────────────────────────────────────────
const ServiceRow = memo(function ServiceRow({ service, selected, onSelect, onToggleFeatured, onMenuAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat   = CATEGORY_STYLES[service.category] ?? { bg: "bg-surface-container", text: "text-on-surface-variant" };
  const avail = AVAILABILITY_OPTS[service.availability] ?? AVAILABILITY_OPTS.unavailable;

  return (
    <tr className="hover:bg-surface-container-low/60 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3.5">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(service.id)}
            className="rounded text-primary cursor-pointer h-3.5 w-3.5 flex-shrink-0"
          />
          <div className="w-11 h-11 rounded-xl bg-surface-container-highest flex-shrink-0 overflow-hidden">
            {service.image ? (
              <img src={service.image} alt={service.name} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconPackage size={18} className="text-on-surface-variant/30" weight="duotone" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">{service.name}</p>
            <p className="text-[10px] text-on-surface-variant">{service.subtitle}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${cat.bg} ${cat.text}`}>
          {service.category}
        </span>
      </td>

      <td className="px-5 py-3.5 text-xs font-bold text-on-surface">{service.price}</td>
      <td className="px-5 py-3.5 text-xs text-on-surface-variant">{service.duration}</td>

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${avail.dot}`} />
          <span className="text-[10px] text-on-surface-variant">{avail.label}</span>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <button
          type="button"
          onClick={() => onToggleFeatured(service.id)}
          title={service.featured ? "Remove from featured" : "Add to featured"}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
            service.featured ? "bg-primary" : "bg-outline-variant"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              service.featured ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </td>

      <td className="px-5 py-3.5 text-right">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all cursor-pointer"
          >
            <IconMoreVert size={15} weight="bold" />
          </button>
          {menuOpen && (
            <ServiceRowMenu
              service={service}
              onAction={(action) => { onMenuAction(action, service); setMenuOpen(false); }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
});

// ── ServicesTable ──────────────────────────────────────────────────────────
export default memo(function ServicesTable({
  services, total, page, perPage,
  selectedIds, selectAll,
  onSelectAll, onSelectRow, onToggleFeatured, onMenuAction, onBulkDelete, onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* ── Controls bar ── */}
      <div className="px-5 py-3.5 border-b border-outline-variant/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/40 cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onSelectAll}
              className="rounded text-primary cursor-pointer h-3.5 w-3.5"
            />
            <span className="text-[10px] font-semibold text-on-surface-variant">Select All</span>
          </label>
          <div className="h-5 w-px bg-outline-variant/50 mx-1" />
          <button
            title="Bulk Edit"
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
          >
            <IconEdit size={14} weight="bold" />
          </button>
          <button
            title="Bulk Hide"
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
          >
            <IconEyeOff size={14} weight="bold" />
          </button>
          <button
            title="Delete Selected"
            onClick={onBulkDelete}
            disabled={selectedIds.size === 0}
            className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <IconDelete size={14} weight="bold" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-[10px] text-on-surface-variant">
            Showing <span className="font-bold">{from}–{to}</span> of{" "}
            <span className="font-bold">{total}</span> services
          </p>
          {totalPages > 1 && (
            <div className="flex gap-0.5">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <IconChevronLeft size={13} weight="bold" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <IconChevronRight size={13} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              {[
                { label: "Service Name", sortable: true },
                { label: "Category" },
                { label: "Base Price" },
                { label: "Duration" },
                { label: "Availability" },
                { label: "Featured", icon: <IconStar size={11} weight="bold" className="text-primary" /> },
                { label: "Actions", right: true },
              ].map(({ label, sortable, icon, right }) => (
                <th
                  key={label}
                  className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant border-b border-outline-variant/30 ${right ? "text-right" : ""}`}
                >
                  <div className={`flex items-center gap-1 ${right ? "justify-end" : ""}`}>
                    {icon}{label}
                    {sortable && <IconChevronDown size={11} weight="bold" className="opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {services.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-xs text-on-surface-variant">
                  No services found.
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <ServiceRow
                  key={s._id ?? s.id}
                  service={s}
                  selected={selectedIds.has(s._id ?? s.id)}
                  onSelect={onSelectRow}
                  onToggleFeatured={onToggleFeatured}
                  onMenuAction={onMenuAction}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2">
            {STAFF_AVATARS.map((s, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-surface overflow-hidden bg-surface-container-highest flex-shrink-0">
                <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-on-surface-variant">6 staff members assigned to these services</span>
        </div>
        {/* Export CSV / Print List — hidden for now */}
      </div>
    </div>
  );
});
