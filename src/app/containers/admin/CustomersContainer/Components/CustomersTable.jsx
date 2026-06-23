"use client";
import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconChevronRight, IconChevronLeft, IconArrowRight } from "@/lib/icons";
import { STATUS_STYLES } from "../data";

function Avatar({ customer }) {
  if (customer.avatar) {
    return (
      <img
        src={customer.avatar}
        alt={customer.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  const initials = customer.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-primary-fixed/40 flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] font-bold text-primary">{initials}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.inactive;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      {s.label}
    </span>
  );
}

const CustomersTable = memo(function CustomersTable({
  customers,
  total,
  page,
  perPage,
  onPageChange,
}) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);

  const handleViewProfile = useCallback(
    (id) => router.push(`/admin/customers/${id}`),
    [router]
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* Table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Email
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Orders
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Lifetime Value
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {customers.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-surface-container-low/50 transition-colors group"
              >
                {/* Customer */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar customer={c} />
                    <div>
                      <p className="text-xs font-semibold text-on-surface leading-tight">{c.name}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{c.joinedAgo}</p>
                    </div>
                  </div>
                </td>
                {/* Email */}
                <td className="px-4 py-3.5">
                  <p className="text-xs text-on-surface-variant truncate max-w-[180px]">{c.email}</p>
                </td>
                {/* Orders */}
                <td className="px-4 py-3.5 text-center">
                  <span className="text-xs font-semibold text-on-surface">{c.orders}</span>
                </td>
                {/* LTV */}
                <td className="px-4 py-3.5 text-right">
                  <span className="text-xs font-bold text-on-surface">{c.ltv}</span>
                </td>
                {/* Status */}
                <td className="px-4 py-3.5 text-center">
                  <StatusBadge status={c.status} />
                </td>
                {/* Action */}
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleViewProfile(c.id)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-primary/70 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    View Profile <IconArrowRight size={11} weight="bold" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant/30">
          <p className="text-[10px] text-on-surface-variant">
            {start}–{end} of {total} customers
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <IconChevronLeft size={13} weight="bold" />
            </button>
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  p === page
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <IconChevronRight size={13} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomersTable;
