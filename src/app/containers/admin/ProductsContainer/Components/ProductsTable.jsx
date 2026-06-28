"use client";
import { memo } from "react";
import { IconEdit, IconDelete, IconWarning, IconPackage } from "@/lib/icons";
import { PRODUCT_STATUS_STYLES } from "../data";

const StockBar = memo(function StockBar({ stock, maxStock }) {
  const pct      = maxStock > 0 ? Math.min(100, Math.round((stock / maxStock) * 100)) : 0;
  const barColor = pct === 0 ? "bg-outline-variant/40" : pct < 20 ? "bg-error" : pct < 50 ? "bg-warning" : "bg-primary";
  const lowText  = pct < 20;
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${lowText ? "text-error font-bold" : "text-on-surface"}`}>{stock}</span>
      <div className="w-14 h-1.5 bg-outline-variant/40 rounded-full overflow-hidden flex-shrink-0">
        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
});

const StatusBadge = memo(function StatusBadge({ status }) {
  const s = PRODUCT_STATUS_STYLES[status] ?? { bg: "bg-gray-100", text: "text-gray-600" };
  if (status === "Low Stock") {
    return (
      <span className={`px-2.5 py-0.5 rounded-full ${s.bg} ${s.text} text-[10px] font-bold uppercase inline-flex items-center gap-1 whitespace-nowrap`}>
        <IconWarning size={11} weight="bold" /> Low Stock
      </span>
    );
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full ${s.bg} ${s.text} text-[10px] font-bold uppercase whitespace-nowrap`}>
      {status}
    </span>
  );
});

const ProductRow = memo(function ProductRow({ product, selected, onSelect, onEdit, onDelete }) {
  return (
    <tr className={`transition-colors group ${selected ? "bg-primary/5" : "hover:bg-primary/[0.03]"}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(product.id)}
          className="rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-variant overflow-hidden border border-outline-variant/30 flex-shrink-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconPackage size={18} className="text-on-surface-variant/50" weight="duotone" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-on-surface truncate max-w-[180px]">{product.name}</p>
            <p className="text-[10px] text-on-surface-variant italic truncate">{product.variant}</p>
          </div>
        </div>
      </td>
      <td className="p-4 font-mono text-xs text-on-surface-variant whitespace-nowrap">{product.sku}</td>
      <td className="p-4 text-xs text-on-surface whitespace-nowrap">{product.category}</td>
      <td className="p-4 text-xs text-on-surface whitespace-nowrap">{product.brand}</td>
      <td className="p-4 text-xs font-bold text-primary whitespace-nowrap">{product.price}</td>
      <td className="p-4">
        <StockBar stock={product.stock} maxStock={product.maxStock} />
      </td>
      <td className="p-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
            title="Edit"
          >
            <IconEdit size={15} weight="bold" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all cursor-pointer"
            title="Delete"
          >
            <IconDelete size={15} weight="bold" />
          </button>
        </div>
      </td>
    </tr>
  );
});

const TABLE_HEADERS = [
  { label: "Product",  right: false },
  { label: "SKU",      right: false },
  { label: "Category", right: false },
  { label: "Brand",    right: false },
  { label: "Price",    right: false },
  { label: "Stock",    right: false },
  { label: "Status",   right: false },
  { label: "Actions",  right: true  },
];

export default memo(function ProductsTable({
  products, selectedIds, selectAll,
  onSelectAll, onSelectRow, onEdit, onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            <th className="p-4 w-12">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
                className="rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer"
              />
            </th>
            {TABLE_HEADERS.map(({ label, right }) => (
              <th
                key={label}
                className={`p-4 text-[10px] font-bold text-outline uppercase tracking-wider whitespace-nowrap ${right ? "text-right" : ""}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {products.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-12 text-center text-xs text-on-surface-variant">
                No products match your filters.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                selected={selectedIds.has(product.id)}
                onSelect={onSelectRow}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
