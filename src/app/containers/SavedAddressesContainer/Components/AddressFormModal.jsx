"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/lib/icons";

const EMPTY = {
  name: "", type: "Home", label: "",
  line1: "", line2: "", city: "", state: "",
  country: "India", pincode: "", phone: "",
  isDefault: false,
};

const TYPES = ["Home", "Work", "Other"];

const FIELDS = [
  { key: "name",    label: "Full Name",      required: true,  placeholder: "John Doe",              half: false },
  { key: "label",   label: "Label",          required: false, placeholder: "e.g. My Home",          half: false },
  { key: "line1",   label: "Address Line 1", required: true,  placeholder: "House no., Street",     half: false },
  { key: "line2",   label: "Address Line 2", required: false, placeholder: "Area, Landmark",        half: false },
  { key: "city",    label: "City",           required: true,  placeholder: "Mumbai",                half: true  },
  { key: "state",   label: "State",          required: true,  placeholder: "Maharashtra",           half: true  },
  { key: "pincode", label: "Pincode",        required: true,  placeholder: "400001",               half: true  },
  { key: "phone",   label: "Phone",          required: true,  placeholder: "+91 98765 43210",       half: true  },
  { key: "country", label: "Country",        required: false, placeholder: "India",                 half: false },
];

export default function AddressFormModal({ open, onClose, onSave, address }) {
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [mounted, setMounted] = useState(false);
  const isEdit = !!address;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      setForm(address ? { ...EMPTY, ...address } : EMPTY);
      setError("");
    }
  }, [open, address]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !mounted) return null;

  // Pair up the half-width fields
  const rows = [];
  let i = 0;
  while (i < FIELDS.length) {
    if (FIELDS[i].half && FIELDS[i + 1]?.half) {
      rows.push({ type: "pair", a: FIELDS[i], b: FIELDS[i + 1] });
      i += 2;
    } else {
      rows.push({ type: "single", f: FIELDS[i] });
      i++;
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-card-xl max-h-[92dvh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-outline-variant/15 flex-shrink-0">
          <div>
            <h2 className="text-sm font-extrabold text-on-surface tracking-tight">
              {isEdit ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              {isEdit ? "Update your delivery details" : "Save a location for faster checkout"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer border-none text-on-surface-variant"
          >
            <IconClose size={15} weight="bold" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={submit} className="overflow-y-auto flex-1 px-5 py-4 space-y-3">

          {/* Type selector */}
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={[
                  "flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer",
                  form.type === t
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-transparent text-on-surface-variant border-outline-variant/50 hover:border-primary/50 hover:text-primary",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Dynamic rows */}
          {rows.map((row, ri) =>
            row.type === "single" ? (
              <Field key={row.f.key} f={row.f} value={form[row.f.key]} onChange={v => set(row.f.key, v)} />
            ) : (
              <div key={ri} className="grid grid-cols-2 gap-2">
                <Field f={row.a} value={form[row.a.key]} onChange={v => set(row.a.key, v)} />
                <Field f={row.b} value={form[row.b.key]} onChange={v => set(row.b.key, v)} />
              </div>
            )
          )}

          {/* Default toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
            <button
              type="button"
              role="switch"
              aria-checked={form.isDefault}
              onClick={() => set("isDefault", !form.isDefault)}
              className={[
                "relative w-9 h-5 rounded-full overflow-hidden transition-colors duration-200 border-none cursor-pointer flex-shrink-0",
                form.isDefault ? "bg-primary" : "bg-outline/30",
              ].join(" ")}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 will-change-transform"
                style={{ transform: form.isDefault ? "translateX(16px)" : "translateX(0px)" }}
              />
            </button>
            <span className="text-xs font-semibold text-on-surface">Set as default address</span>
          </label>

          {error && (
            <p className="text-[11px] text-error font-semibold bg-error/8 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </form>

        {/* Footer actions */}
        <div className="flex gap-2 px-5 py-4 border-t border-outline-variant/15 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant border border-outline-variant/50 hover:bg-surface-container transition-all cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="addr-form"
            disabled={saving}
            onClick={submit}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:shadow-brand-sm hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer border-none disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Address"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Field({ f, value, onChange }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
        {f.label}
        {f.required && <span className="text-error ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        required={f.required}
        placeholder={f.placeholder}
        className="w-full bg-surface border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface placeholder-on-surface-variant/35 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
      />
    </div>
  );
}
