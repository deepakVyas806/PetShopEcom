"use client";
import { useState, useCallback, useEffect } from "react";
import { IconClose, IconTag } from "@/lib/icons";
import { fmt } from "@/lib/currency";

const DISCOUNT_TYPES = [
  { value: "percent",  label: "Percentage (%)"     },
  { value: "fixed",    label: "Fixed Amount (₹)"   },
  { value: "bogo",     label: "Buy 1 Get 1"        },
  { value: "freeship", label: "Free Shipping"      },
];

const STATUSES = [
  { value: "active",    label: "Active"    },
  { value: "scheduled", label: "Scheduled" },
  { value: "paused",    label: "Paused"    },
];

const EMPTY = {
  name:         "",
  code:         "",
  description:  "",
  discountType: "percent",
  value:        "",
  minOrder:     "",
  usageLimit:   "",
  startDate:    "",
  endDate:      "",
  status:       "active",
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

export default function CreateCouponModal({ coupon, onSave, onClose }) {
  const isEdit = Boolean(coupon?.id);
  const [form,  setForm]  = useState(() => coupon ? couponToForm(coupon) : { ...EMPTY });
  const [error, setError] = useState("");

  // Reset when the target coupon changes
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
    });
  }, [form, coupon, onSave]);

  const suffix = valueLabel(form.discountType);
  const preview = previewDiscount(form);
  const showValue = form.discountType === "percent" || form.discountType === "fixed";

  const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-surface rounded-2xl w-full max-w-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top accent */}
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
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <IconClose size={15} weight="bold" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* Promotion name */}
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
              Promotion Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Winter Sale 2026"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* Code + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                Coupon Code <span className="text-error">*</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  className={`${inputCls} flex-1 font-mono uppercase font-bold text-primary`}
                  placeholder="WINTER20"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                />
                <button
                  type="button"
                  title="Auto-generate code"
                  onClick={() => set("code", generateCode(form.name || "PROMO"))}
                  className="px-2.5 py-2 text-[10px] font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer flex-shrink-0"
                >
                  Auto
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                Discount Type
              </label>
              <select
                className={inputCls}
                value={form.discountType}
                onChange={(e) => { set("discountType", e.target.value); set("value", ""); }}
              >
                {DISCOUNT_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. 20% off all dog toys"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Value + Min order */}
          <div className="grid grid-cols-2 gap-3">
            {showValue && (
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  Discount Value <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={form.discountType === "percent" ? 100 : undefined}
                    className={`${inputCls} ${suffix ? "pr-8" : ""}`}
                    placeholder={form.discountType === "percent" ? "20" : "200"}
                    value={form.value}
                    onChange={(e) => set("value", e.target.value)}
                  />
                  {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant">
                      {suffix}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className={showValue ? "" : "col-span-2"}>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                Min. Order Amount (₹)
              </label>
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="0 = no minimum"
                value={form.minOrder}
                onChange={(e) => set("minOrder", e.target.value)}
              />
            </div>
          </div>

          {/* Usage limit + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                Usage Limit
              </label>
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="0 = unlimited"
                value={form.usageLimit}
                onChange={(e) => set("usageLimit", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                Status
              </label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
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
                <input
                  type="date"
                  className={inputCls}
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  End Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  min={form.startDate}
                  className={inputCls}
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
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
                  <p><span className="font-semibold">Min order:</span> {form.minOrder ? fmt(Number(form.minOrder)) : "No minimum"}</p>
                  <p><span className="font-semibold">Valid:</span> {form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "—"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-[10px] text-error font-semibold">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/20"
          >
            {isEdit ? "Save Changes" : "Launch Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}
