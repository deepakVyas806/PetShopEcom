"use client";
import { memo, useState } from "react";
import { IconMoreVert } from "@/lib/icons";
import { STATUS_STYLES } from "../data";
import OrderRowMenu from "./OrderRowMenu";

const StatusBadge = memo(function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`px-2.5 py-0.5 ${s.bg} ${s.text} rounded-full text-[10px] font-bold inline-flex items-center gap-1 whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 ${s.dot} rounded-full flex-shrink-0`} />
      {status}
    </span>
  );
});

const OrderRow = memo(function OrderRow({ order, selected, onSelect, onMenuAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className={`transition-colors ${selected ? "bg-primary/5" : "hover:bg-primary/[0.03]"}`}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(order.id)}
          className="rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-primary whitespace-nowrap">{order.id}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          {order.avatar ? (
            <img
              src={order.avatar}
              alt={order.customer}
              loading="lazy"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className={`w-8 h-8 rounded-full ${order.avatarBg} ${order.avatarFg} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
              {order.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-on-surface truncate">{order.customer}</p>
            <p className="text-[10px] text-on-surface-variant truncate">{order.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-on-surface-variant whitespace-nowrap">{order.date}</td>
      <td className="px-4 py-3 text-xs font-bold text-on-surface whitespace-nowrap">{order.amount}</td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="relative inline-block">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 hover:bg-surface-variant rounded-full text-on-surface-variant transition-all cursor-pointer"
          >
            <IconMoreVert size={16} />
          </button>
          {menuOpen && (
            <OrderRowMenu
              order={order}
              onAction={onMenuAction}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </td>
    </tr>
  );
});

const TABLE_HEADERS = ["Order ID", "Customer", "Date", "Amount", "Status", ""];

export default memo(function OrdersTable({ orders, selectedIds, selectAll, onSelectAll, onSelectRow, onMenuAction }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
                className="rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer"
              />
            </th>
            {TABLE_HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-xs text-on-surface-variant">
                No orders match your filters.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                selected={selectedIds.has(order.id)}
                onSelect={onSelectRow}
                onMenuAction={onMenuAction}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
