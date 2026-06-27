"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { IconClose, IconTag, IconSearch, IconDelete } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import { api, qs } from "@/lib/api";

const DISCOUNT_TYPES = [
  { value: "percent",  label: "Percentage (%)"  },
  { value: "fixed",    label: "Fixed Amount (₹)" },
  { value: "bogo",     label: "Buy 1 Get 1"      },
  { value: "freeship", label: "Free Shipping"    },
];

const SCOPE_OPTIONS = [
  { value: "global",   label: "All Products & Services", hint: "Applies to the entire cart" },
  { value: "product",  label: "Specific Products",        hint: "Only discounts selected products" },
  { value: "category", label: "Product Category",         hint: "Only discounts a product category" },
  { value: "service",  label: "Specific Services",        hint: "Only discounts selected services"  },
];

const STATUSES = [
  { value: "active",    label: "Active"    },
  { value: "scheduled", label: "Scheduled" },
  { value: "paused",    label: "Paused"    },
];

const EMPTY = {
  name: "", code: "", description: "", discountType: "percent", value: "",
  minOrder: "", usageLimit: "", startDate: "", endDate: "", status: "active",
  scope: "global", productIds: [], categoryIds: [], serviceIds: [],
};

function couponToForm(c) {
  return {
    name:         c.name         ?? "",
    code:         c.code         ?? "",
    description:  c.description  ?? "",
    discountType: c.discountType ?? "percent",
    value:        String(c.value ?? ""),
    minOrder:     String(c.minOrderRaw ?? ""),
    usageLimit:   String(c.usageLimit  ?? ""),
    startDate:    c.startDate    ?? "",
    endDate:      c.endDate      ?? "",
    status:       c.status       ?? "active",
    scope:        c.scope        ?? "global",
    productIds:   c.productIds   ?? [],
    categoryIds:  c.categoryIds  ?? [],
    serviceIds:   c.serviceIds   ?? [],
  };
}

function generateCode(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const initials = words.map((w) => w[0]).join("").toUpperCase();
  const num = Math.floor(Math.random() * 90 + 10);
  return `${initials}${num}`;
}

function valueLabel(discountType) {
  if (discountType === "percent") return "%";
  if (discountType === "fixed")   return "₹";
  return null;
}

function previewDiscount(form) {
  if (form.discountType === "percent"  && form.value) return `${form.value}% off`;
  if (form.discountType === "fixed"    && form.value) return `${fmt(Number(form.value))} off`;
  if (form.discountType === "freeship")               return "Free Shipping";
  if (form.discountType === "bogo")                   return "Buy 1 Get 1";
  return null;
}

// ── Async search-select picker ────────────────────────────────────────────────
function SearchPicker({ label, placeholder, endpoint, labelKey = "name", valueKey = "_id", selected, onChange }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const timer = useRef(null);
  const ref   = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!query.trim()) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      try {
        const data = await api.get(`${endpoint}${qs({ search: query, limit: 6 })}`);
        const items = data.products ?? data.services ?? data.items ?? [];
        setResults(items);
        setOpen(true);
      } catch { setResults([]); }
    }, 300);
  }, [query, endpoint]);

  const toggle = (item) => {
    const id = item[valueKey];
    const exists = selected.find(s => s.id === id);
    onChange(exists
      ? selected.filter(s => s.id !== id)
      : [...selected, { id, name: item[labelKey] }]
    );
  };

  const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div>
      <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">{label}</label>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(s => (
            <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              {s.name}
              <button type="button" onClick={() => onChange(selected.filter(x => x.id !== s.id))} className="cursor-pointer bg-transparent border-none p-0 leading-none text-primary/70 hover:text-error">
                <IconDelete size={10} weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative" ref={ref}>
        <IconSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
        <input
          type="text"
          className={`${inputCls} pl-8`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
        />
        {open && results.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full bg-surface rounded-xl border border-outline-variant/40 shadow-xl overflow-hidden">
            {results.map(item => {
              const id = item[valueKey];
              const isSelected = selected.some(s => s.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { toggle(item); setQuery(""); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] text-left transition-colors cursor-pointer border-none ${isSelected ? "bg-primary/10 text-primary font-bold" : "text-on-surface hover:bg-surface-container-low"}`}
                >
                  {isSelected && <span className="text-[9px]">✓</span>}
                  {item[labelKey]}
                  {item.price && <span className="ml-auto text-on-surface-variant">{fmt(item.price)}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Category dropdown ─────────────────────────────────────────────────────────
function CategoryPicker({ selected, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/catalog?type=category&limit=50")
      .then(data => setCategories(data.items ?? []))
      .catch(() => {});
  }, []);

  const toggle = (cat) => {
    const exists = selected.find(s => s.id === cat._id);
    onChange(exists
      ? selected.filter(s => s.id !== cat._id)
      : [...selected, { id: cat._id, name: cat.name }]
    );
  };

  if (!categories.length) return (
    <p className="text-[10px] text-on-surface-variant">Loading categories…</p>
  );

  return (
    <div>
      <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Select Categories</label>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const active = selected.some(s => s.id === cat._id);
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => toggle(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                active
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:border-primary/40"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-[10px] text-on-surface-variant mt-1.5">
          {selected.length} categor{selected.length === 1 ? "y" : "ies"} selected
        </p>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function CreateCouponModal({ coupon, onSave, onClose }) {
  const isEdit = Boolean(coupon?.id);
  const [form,  setForm]  = useState(() => coupon ? couponToForm(coupon) : { ...EMPTY });
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(coupon ? couponToForm(coupon) : { ...EMPTY });
    setError("");
  }, [coupon]);

  const set = useCallback((k, v) => setForm((p) => ({ ...p, [k]: v })), []);

  const handleSave = useCallback(() => {
    if (!form.name.trim())             { setError("Promotion name is required.");  return; }
    if (!form.code.trim())             { setError("Coupon code is required.");      return; }
    if (!form.startDate)               { setError("Start date is required.");       return; }
    if (!form.endDate)                 { setError("End date is required.");         return; }
    if (form.endDate < form.startDate) { setError("End date must be after start."); return; }
    const needsValue = form.discountType === "percent" || form.discountType === "fixed";
    if (needsValue && (!form.value || Number(form.value) <= 0)) {
      setError("Please enter a valid discount value."); return;
    }
    if (form.discountType === "percent" && Number(form.value) > 100) {
      setError("Percentage cannot exceed 100."); return;
    }
    if (form.scope === "product"  && !form.productIds.length)  { setError("Select at least one product.");  return; }
    if (form.scope === "category" && !form.categoryIds.length) { setError("Select at least one category."); return; }
    if (form.scope === "service"  && !form.serviceIds.length)  { setError("Select at least one service.");  return; }

    onSave({
      ...(coupon ?? {}),
      name:         form.name.trim(),
      code:         form.code.trim().toUpperCase(),
      description:  form.description.trim(),
      discountType: form.discountType,
      value:        Number(form.value) || 0,
      minOrderRaw:  Number(form.minOrder) || 0,
      usageLimit:   Number(form.usageLimit) || 0,
      startDate:    form.startDate,
      endDate:      form.endDate,
      status:       form.status,
      scope:        form.scope,
      productIds:   form.productIds.map(p => p.id),
      categoryIds:  form.categoryIds.map(c => c.id),
      serviceIds:   form.serviceIds.map(s => s.id),
    });
  }, [form, coupon, onSave]);

  const suffix    = valueLabel(form.discountType);
  const preview   = previewDiscount(form);
  const showValue = form.discountType === "percent" || form.discountType === "fixed";

  const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface rounded-2xl w-full max-w-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-primary to-tertiary" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <IconTag size={16} weight="bold" className="text-primary" />
            </div>
            <p className="text-xs font-bold text-on-surface">
              {isEdit ? "Edit Coupon" : "Create New Coupon"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer">
            <IconClose size={15} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
              Promotion Name <span className="text-error">*</span>
            </label>
            <input type="text" className={inputCls} placeholder="e.g. Summer Sale 2026" value={form.name}
              onChange={(e) => set("name", e.target.value)} />
          </div>

          {/* Code + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                Coupon Code <span className="text-error">*</span>
              </label>
              <div className="flex gap-1.5">
                <input type="text" className={`${inputCls} flex-1 font-mono uppercase font-bold text-primary`}
                  placeholder="SUMMER20" value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())} />
                <button type="button" onClick={() => set("code", generateCode(form.name || "PROMO"))}
                  className="px-2.5 py-2 text-[10px] font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer flex-shrink-0">
                  Auto
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Discount Type</label>
              <select className={inputCls} value={form.discountType}
                onChange={(e) => { set("discountType", e.target.value); set("value", ""); }}>
                {DISCOUNT_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Short Description</label>
            <input type="text" className={inputCls} placeholder="e.g. 20% off all dog food"
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {/* Scope */}
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-2">
              Applies To <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SCOPE_OPTIONS.map(({ value, label, hint }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("scope", value)}
                  className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    form.scope === value
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:border-primary/40"
                  }`}
                >
                  <span className="text-[10px] font-bold">{label}</span>
                  <span className={`text-[9px] ${form.scope === value ? "text-primary/70" : "text-on-surface-variant/60"}`}>{hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope-specific pickers */}
          {form.scope === "product" && (
            <SearchPicker
              label="Select Products"
              placeholder="Search products by name…"
              endpoint="/products"
              selected={form.productIds}
              onChange={(v) => set("productIds", v)}
            />
          )}
          {form.scope === "category" && (
            <CategoryPicker
              selected={form.categoryIds}
              onChange={(v) => set("categoryIds", v)}
            />
          )}
          {form.scope === "service" && (
            <SearchPicker
              label="Select Services"
              placeholder="Search services by name…"
              endpoint="/services"
              selected={form.serviceIds}
              onChange={(v) => set("serviceIds", v)}
            />
          )}

          {/* Value + Min order */}
          <div className="grid grid-cols-2 gap-3">
            {showValue && (
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  Discount Value <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input type="number" min={1} max={form.discountType === "percent" ? 100 : undefined}
                    className={`${inputCls} ${suffix ? "pr-8" : ""}`}
                    placeholder={form.discountType === "percent" ? "20" : "200"}
                    value={form.value} onChange={(e) => set("value", e.target.value)} />
                  {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant">{suffix}</span>
                  )}
                </div>
              </div>
            )}
            <div className={showValue ? "" : "col-span-2"}>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Min. Order Amount (₹)</label>
              <input type="number" min={0} className={inputCls} placeholder="0 = no minimum"
                value={form.minOrder} onChange={(e) => set("minOrder", e.target.value)} />
            </div>
          </div>

          {/* Usage limit + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Usage Limit</label>
              <input type="number" min={0} className={inputCls} placeholder="0 = unlimited"
                value={form.usageLimit} onChange={(e) => set("usageLimit", e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date range */}
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4 space-y-3">
            <div>
              <p className="text-[10px] font-bold text-primary">Schedule Promotion</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Set start and end dates for this offer.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  Start Date <span className="text-error">*</span>
                </label>
                <input type="date" className={inputCls} value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  End Date <span className="text-error">*</span>
                </label>
                <input type="date" min={form.startDate} className={inputCls} value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Live preview */}
          {(form.code || preview) && (
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
              <p className="text-[10px] font-bold text-on-surface-variant mb-2.5 uppercase tracking-widest">Preview</p>
              <div className="flex items-center gap-3">
                <div className="border-2 border-dashed border-primary/40 rounded-xl px-4 py-3 flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-xs font-bold font-mono text-primary">{form.code || "CODE"}</span>
                  {preview && <span className="text-[10px] text-on-surface-variant">{preview}</span>}
                </div>
                <div className="text-[10px] text-on-surface-variant space-y-0.5">
                  <p><span className="font-semibold">Name:</span> {form.name || "—"}</p>
                  <p><span className="font-semibold">Applies to:</span> {SCOPE_OPTIONS.find(s => s.value === form.scope)?.label}</p>
                  <p><span className="font-semibold">Min order:</span> {form.minOrder ? fmt(Number(form.minOrder)) : "No minimum"}</p>
                  <p><span className="font-semibold">Valid:</span> {form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "—"}</p>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-[10px] text-error font-semibold">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low/30">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer">
            Discard
          </button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/20">
            {isEdit ? "Save Changes" : "Launch Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}
