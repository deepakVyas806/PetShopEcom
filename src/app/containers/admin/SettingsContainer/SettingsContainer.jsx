"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { IconChevronRight, IconCheck, IconSpinner } from "@/lib/icons";

const DEFAULT_SETTINGS = {
  taxRate:               18,
  freeShippingThreshold: 999,
  baseShippingCost:      50,
  deliveryOptions: [
    { key: "standard", label: "Standard Delivery", description: "3–5 business days", cost: 0,   active: true  },
    { key: "express",  label: "Express Delivery",  description: "1–2 business days",  cost: 99,  active: true  },
    { key: "same_day", label: "Same Day Delivery", description: "Order before 12 PM", cost: 199, active: false },
  ],
  couponMinOrder:    0,
  couponMaxDiscount: 500,
  storeName:         "artPet Shop",
  storeEmail:        "",
  storePhone:        "",
};

const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";
const INP = "flex-1 w-full px-3 py-2.5 bg-transparent text-xs font-medium text-on-surface focus:outline-none placeholder:text-on-surface-variant min-w-0";

function Field({ label, hint, prefix, suffix, children }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      <div className="flex items-stretch border border-outline-variant/50 rounded-xl overflow-hidden bg-surface-container-low focus-within:ring-2 focus-within:ring-primary/30">
        {prefix && (
          <span className="px-3 flex items-center text-xs font-bold text-on-surface-variant bg-surface-container border-r border-outline-variant/30 flex-shrink-0">
            {prefix}
          </span>
        )}
        {children}
        {suffix && (
          <span className="px-3 flex items-center text-xs text-on-surface-variant bg-surface-container border-l border-outline-variant/30 flex-shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[10px] text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

function Section({ emoji, title, subtitle, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card-sm overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-3 border-b border-outline-variant/20 bg-surface-container-low">
        <span className="text-xl">{emoji}</span>
        <div>
          <h3 className="text-xs font-bold text-on-surface">{title}</h3>
          {subtitle && <p className="text-[10px] text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative rounded-full transition-colors cursor-pointer border-none flex-shrink-0 ${on ? "bg-primary" : "bg-outline-variant"}`}
      style={{ width: 32, height: 18 }}
    >
      <span className={`absolute top-[2px] w-[13px] h-[13px] rounded-full bg-white shadow transition-all ${on ? "left-[17px]" : "left-[2px]"}`} />
    </button>
  );
}

export default function SettingsContainer() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    api.get("/admin/settings")
      .then(d => { if (d.settings) setSettings(s => ({ ...s, ...d.settings })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set    = (key) => (e) => setSettings(s => ({ ...s, [key]: e.target.value }));
  const setNum = (key) => (e) => setSettings(s => ({ ...s, [key]: Number(e.target.value) }));

  const setDelivery = (key, prop, val) =>
    setSettings(s => ({
      ...s,
      deliveryOptions: s.deliveryOptions.map(o => o.key === key ? { ...o, [prop]: val } : o),
    }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.patch("/admin/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message ?? "Failed to save settings.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <IconSpinner size={20} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1 text-[10px] text-on-surface-variant mb-1.5">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <IconChevronRight size={11} />
            <span className="text-primary font-semibold">Settings</span>
          </nav>
          <h1 className="text-sm font-bold text-on-surface">Store Settings</h1>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Central configuration — these values drive tax, shipping, checkout calculations, and more.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-success font-semibold">
              <IconCheck size={12} weight="bold" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold shadow-brand-sm hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-70"
          >
            {saving ? <IconSpinner size={13} className="animate-spin" /> : <IconCheck size={13} weight="bold" />}
            Save All Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Tax */}
        <Section emoji="💸" title="Tax & Pricing" subtitle="Applied at checkout to every product order">
          <Field label="GST Rate" hint="18% is the standard Indian GST rate for most retail goods" suffix="%">
            <input type="number" className={INP} value={settings.taxRate} onChange={setNum("taxRate")} min={0} max={100} step={0.5} />
          </Field>
          <div className="px-3 py-2.5 bg-surface-container rounded-xl text-[10px] text-on-surface-variant border border-outline-variant/20">
            <span className="font-bold text-on-surface">Currency:</span> ₹ INR — Indian Rupee. Prices are stored natively in INR (conversion rate = 1).
          </div>
        </Section>

        {/* Shipping */}
        <Section emoji="🚚" title="Shipping" subtitle="Controls cart and checkout shipping cost logic">
          <Field label="Free Shipping Threshold" hint="Orders above this amount get free standard shipping" prefix="₹">
            <input type="number" className={INP} value={settings.freeShippingThreshold} onChange={setNum("freeShippingThreshold")} min={0} />
          </Field>
          <Field label="Base Shipping Cost" hint="Applied when the cart total is below the free shipping threshold" prefix="₹">
            <input type="number" className={INP} value={settings.baseShippingCost} onChange={setNum("baseShippingCost")} min={0} />
          </Field>
        </Section>

        {/* Delivery speed options — full width */}
        <div className="lg:col-span-2">
          <Section emoji="📦" title="Delivery Speed Options" subtitle="Shown to customers on the checkout delivery step — set cost and enable/disable per tier">
            <div className="space-y-2">
              {(settings.deliveryOptions ?? []).map(opt => (
                <div key={opt.key} className="flex items-center gap-3 p-3.5 border border-outline-variant/30 rounded-xl hover:border-primary/30 transition-colors">
                  <span className="text-lg flex-shrink-0">
                    {opt.key === "standard" ? "📦" : opt.key === "express" ? "⚡" : "🏎"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface">{opt.label}</p>
                    <p className="text-[10px] text-on-surface-variant">{opt.description}</p>
                  </div>

                  {opt.key === "standard" ? (
                    <div className="text-[10px] font-bold text-success bg-success/10 px-3 py-1.5 rounded-xl border border-success/20 flex-shrink-0">
                      FREE above ₹{settings.freeShippingThreshold}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-stretch border border-outline-variant/50 rounded-lg overflow-hidden bg-surface-container-low w-28">
                        <span className="px-2 flex items-center text-xs font-bold text-on-surface-variant bg-surface-container border-r border-outline-variant/30 flex-shrink-0">₹</span>
                        <input
                          type="number"
                          className="flex-1 min-w-0 px-2 py-2 bg-transparent text-xs font-medium text-on-surface focus:outline-none text-right"
                          value={opt.cost}
                          onChange={e => setDelivery(opt.key, "cost", Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <Toggle on={opt.active} onChange={() => setDelivery(opt.key, "active", !opt.active)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">
              Standard delivery is always visible. Toggle Express/Same-Day off to hide them from the checkout page.
            </p>
          </Section>
        </div>

        {/* Coupon defaults */}
        <Section emoji="🏷" title="Coupon Defaults" subtitle="Global fallback limits — individual coupons can override these">
          <Field label="Min Order Value" hint="Set to 0 for no minimum" prefix="₹">
            <input type="number" className={INP} value={settings.couponMinOrder} onChange={setNum("couponMinOrder")} min={0} />
          </Field>
          <Field label="Max Discount Cap" hint="Set to 0 for no cap" prefix="₹">
            <input type="number" className={INP} value={settings.couponMaxDiscount} onChange={setNum("couponMaxDiscount")} min={0} />
          </Field>
        </Section>

        {/* Store identity */}
        <Section emoji="🏪" title="Store Identity" subtitle="Used in order confirmation emails and receipts">
          <Field label="Store Name">
            <input type="text" className={INP} value={settings.storeName} onChange={set("storeName")} placeholder="artPet Shop" />
          </Field>
          <Field label="Support Email">
            <input type="email" className={INP} value={settings.storeEmail} onChange={set("storeEmail")} placeholder="support@artpetshop.in" />
          </Field>
          <Field label="Support Phone" prefix="+91">
            <input type="tel" className={INP} value={settings.storePhone} onChange={set("storePhone")} placeholder="98765 43210" />
          </Field>
        </Section>

      </div>
    </div>
  );
}
