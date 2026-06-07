"use client";
import { memo, useState, useCallback } from "react";
import { IconClose, IconAdd, IconEdit } from "@/lib/icons";
import { CATEGORIES, BRANDS } from "../data";

const CONTENT_CATS  = CATEGORIES.filter((c) => c !== CATEGORIES[0]);
const CONTENT_BRANDS = BRANDS.filter((b) => b !== BRANDS[0]);

const EMPTY_FORM = {
  id: "",
  name: "",
  variant: "",
  sku: "",
  category: CONTENT_CATS[0],
  brand: CONTENT_BRANDS[0],
  priceRaw: "",
  stock: "",
  maxStock: "",
  image: "",
};

const inputCls  = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const selectCls = `${inputCls} cursor-pointer`;

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default memo(function ProductFormDrawer({ product, onSave, onClose }) {
  const isEdit = Boolean(product?.id);

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...product,
    priceRaw: product?.priceRaw ?? "",
    stock:    product?.stock    ?? "",
    maxStock: product?.maxStock ?? "",
    category: product?.category ?? CONTENT_CATS[0],
    brand:    product?.brand    ?? CONTENT_BRANDS[0],
  }));

  const set = useCallback((key, val) => setForm((f) => ({ ...f, [key]: val })), []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSave(form);
  }, [form, onSave]);

  return (
    <>
      <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-surface shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 flex-shrink-0 bg-surface-container-low/40">
          <div>
            <p className="text-[10px] text-on-surface-variant">Product</p>
            <p className="text-xs font-bold text-on-surface">{isEdit ? "Edit Product" : "Add New Product"}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full cursor-pointer transition-all">
            <IconClose size={15} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <Field label="Product Name *">
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Artisan Salmon & Kelp Mix"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="SKU">
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="APS-FD-001"
                readOnly={isEdit}
                className={`${inputCls} ${isEdit ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </Field>
            <Field label="Variant / Size">
              <input
                type="text"
                value={form.variant}
                onChange={(e) => set("variant", e.target.value)}
                placeholder="Weight: 5kg"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category *">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={selectCls}>
                {CONTENT_CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Brand *">
              <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={selectCls}>
                {CONTENT_BRANDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Price (₹) *">
              <input
                required
                type="number"
                min="0"
                value={form.priceRaw}
                onChange={(e) => set("priceRaw", e.target.value)}
                placeholder="3500"
                className={inputCls}
              />
            </Field>
            <Field label="Stock Qty *">
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="100"
                className={inputCls}
              />
            </Field>
            <Field label="Max Stock">
              <input
                type="number"
                min="0"
                value={form.maxStock}
                onChange={(e) => set("maxStock", e.target.value)}
                placeholder="200"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Image URL (optional)">
            <input
              type="url"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          {form.image && (
            <div className="rounded-xl overflow-hidden h-28 bg-surface-container-low border border-outline-variant/30">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          <p className="text-[10px] text-on-surface-variant">* Required fields</p>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-outline-variant/30 flex gap-2 flex-shrink-0 bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-outline-variant rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isEdit
              ? <><IconEdit size={13} weight="bold" /> Save Changes</>
              : <><IconAdd size={13} weight="bold" /> Add Product</>
            }
          </button>
        </div>
      </div>
    </>
  );
});
