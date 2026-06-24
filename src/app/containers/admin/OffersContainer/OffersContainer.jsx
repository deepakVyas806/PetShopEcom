"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  IconAdd, IconEdit, IconDelete, IconClose,
  IconCheck, IconSpinner, IconChevronRight,
} from "@/lib/icons";

const EMPTY_FORM = {
  headline:          "",
  subtitle:          "",
  badge:             "",
  emoji:             "🎁",
  gradientFrom:      "#f97316",
  gradientTo:        "#ef4444",
  ctaLabel:          "Shop Now",
  ctaHref:           "/marketplace",
  showOnLandingPage: true,
  active:            true,
};

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

function GradientPreview({ from, to, emoji, headline, badge, ctaLabel }) {
  return (
    <div
      className="relative rounded-xl p-4 overflow-hidden flex flex-col justify-between min-h-[110px]"
      style={{ background: `linear-gradient(135deg, ${from || "#f97316"}, ${to || "#ef4444"})` }}
    >
      {badge && (
        <span className="self-start bg-black/20 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="absolute -bottom-2 -right-1 text-6xl opacity-15 select-none pointer-events-none">{emoji || "🎁"}</div>
      <div className="mt-2">
        <p className="text-white font-black text-lg leading-tight drop-shadow-sm">{headline || "Headline"}</p>
      </div>
      <span className="mt-3 self-start bg-white text-gray-900 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
        {ctaLabel || "Shop Now"} →
      </span>
    </div>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative rounded-full transition-colors cursor-pointer border-none flex-shrink-0 disabled:opacity-60 ${checked ? "bg-primary" : "bg-outline-variant"}`}
      style={{ width: 32, height: 18 }}
    >
      <span className={`absolute top-[2px] w-[13px] h-[13px] rounded-full bg-white shadow transition-all ${checked ? "left-[17px]" : "left-[2px]"}`} />
    </button>
  );
}

export default function OffersContainer() {
  const [offers,      setOffers]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formError,   setFormError]   = useState("");
  const [formSaving,  setFormSaving]  = useState(false);
  const [togglingId,  setTogglingId]  = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);
  const fetchedRef = useRef(false);

  const fetchOffers = useCallback(async (force = false) => {
    if (!force && fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const data = await api.get("/admin/offers");
      setOffers(data.offers ?? []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setModal({ mode: "add" });
  };

  const openEdit = (offer) => {
    setForm({
      headline:          offer.headline          ?? "",
      subtitle:          offer.subtitle          ?? "",
      badge:             offer.badge             ?? "",
      emoji:             offer.emoji             ?? "🎁",
      gradientFrom:      offer.gradientFrom      ?? "#f97316",
      gradientTo:        offer.gradientTo        ?? "#ef4444",
      ctaLabel:          offer.ctaLabel          ?? "Shop Now",
      ctaHref:           offer.ctaHref           ?? "/marketplace",
      showOnLandingPage: offer.showOnLandingPage ?? true,
      active:            offer.active            ?? true,
    });
    setFormError("");
    setModal({ mode: "edit", offer });
  };

  const closeModal = () => { setModal(null); setFormError(""); };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.headline.trim()) { setFormError("Headline is required."); return; }
    setFormSaving(true);
    setFormError("");
    try {
      if (modal.mode === "add") {
        await api.post("/admin/offers", form);
      } else {
        await api.put(`/admin/offers/${modal.offer._id}`, form);
      }
      await fetchOffers(true);
      closeModal();
    } catch (e) {
      setFormError(e.message ?? "Failed to save.");
    }
    setFormSaving(false);
  };

  const handleToggleActive = async (offer) => {
    setTogglingId(offer._id + "_active");
    try {
      const data = await api.patch(`/admin/offers/${offer._id}/toggle`);
      setOffers(prev => prev.map(o => o._id === offer._id ? data.offer : o));
    } catch {}
    setTogglingId(null);
  };

  const handleToggleLanding = async (offer) => {
    setTogglingId(offer._id + "_landing");
    try {
      const data = await api.patch(`/admin/offers/${offer._id}/landing`);
      setOffers(prev => prev.map(o => o._id === offer._id ? data.offer : o));
    } catch {}
    setTogglingId(null);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/admin/offers/${id}`);
      setOffers(prev => prev.filter(o => o._id !== id));
    } catch {}
    setDeleteId(null);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1 text-[10px] text-on-surface-variant mb-1.5">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <IconChevronRight size={11} />
            <span className="text-primary font-semibold">Offers</span>
          </nav>
          <h1 className="text-sm font-bold text-on-surface">Offer Zone</h1>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Manage promotional banners. Toggle "Show on Landing Page" to control which appear in the Offer Zone section.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none flex-shrink-0"
        >
          <IconAdd size={13} weight="bold" />
          Add Offer
        </button>
      </div>

      {/* List */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid gap-3 px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/20 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant"
          style={{ gridTemplateColumns: "1fr 120px 120px 80px 68px" }}>
          <span>Offer</span>
          <span>Landing Page</span>
          <span>Active</span>
          <span className="text-center">Preview</span>
          <span />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <IconSpinner size={20} className="text-primary animate-spin" />
          </div>
        )}

        {!loading && offers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm font-bold text-on-surface-variant">No offers yet</p>
            <button onClick={openAdd} className="text-xs text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none">
              + Add Offer
            </button>
          </div>
        )}

        {!loading && offers.map(offer => (
          <div
            key={offer._id}
            className="grid gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/40 group transition-colors items-center"
            style={{ gridTemplateColumns: "1fr 120px 120px 80px 68px" }}
          >
            {/* Offer info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base">{offer.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{offer.headline}</p>
                  {offer.subtitle && <p className="text-[10px] text-on-surface-variant truncate">{offer.subtitle}</p>}
                  {offer.badge && <span className="text-[9px] text-on-surface-variant font-medium">{offer.badge}</span>}
                </div>
              </div>
            </div>

            {/* Landing page toggle */}
            <div className="flex items-center gap-2">
              <Toggle
                checked={offer.showOnLandingPage}
                onChange={() => handleToggleLanding(offer)}
                disabled={togglingId === offer._id + "_landing"}
              />
              <span className="text-[10px] text-on-surface-variant">{offer.showOnLandingPage ? "Shown" : "Hidden"}</span>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <Toggle
                checked={offer.active}
                onChange={() => handleToggleActive(offer)}
                disabled={togglingId === offer._id + "_active"}
              />
              <span className="text-[10px] text-on-surface-variant">{offer.active ? "Live" : "Off"}</span>
            </div>

            {/* Mini preview */}
            <div
              className="w-16 h-10 rounded-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${offer.gradientFrom || "#f97316"}, ${offer.gradientTo || "#ef4444"})` }}
              title={`${offer.gradientFrom} → ${offer.gradientTo}`}
            />

            {/* Actions */}
            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(offer)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer bg-transparent border-none"
                title="Edit"
              >
                <IconEdit size={13} weight="bold" />
              </button>
              <button
                onClick={() => handleDelete(offer._id)}
                disabled={deleteId === offer._id}
                className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all cursor-pointer bg-transparent border-none disabled:opacity-50"
                title="Delete"
              >
                {deleteId === offer._id
                  ? <IconSpinner size={13} className="animate-spin" />
                  : <IconDelete size={13} weight="bold" />}
              </button>
            </div>
          </div>
        ))}

        {!loading && (
          <div className="px-4 py-3 bg-surface-container-low border-t border-outline-variant/10 flex items-center gap-2">
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              <IconAdd size={12} weight="bold" />
              Add Offer
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-on-surface">
                {modal.mode === "add" ? "Add Offer" : "Edit Offer"}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer bg-transparent border-none">
                <IconClose size={16} weight="bold" />
              </button>
            </div>

            {/* Live preview */}
            <div className="mb-5">
              <label className={lbl}>Preview</label>
              <GradientPreview
                from={form.gradientFrom}
                to={form.gradientTo}
                emoji={form.emoji}
                headline={form.headline}
                badge={form.badge}
                ctaLabel={form.ctaLabel}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className={lbl}>Headline *</label>
                <input type="text" value={form.headline} onChange={e => setField("headline", e.target.value)}
                  placeholder="e.g. Up to 40% Off" className={inp} autoFocus />
              </div>

              <div>
                <label className={lbl}>Subtitle</label>
                <input type="text" value={form.subtitle} onChange={e => setField("subtitle", e.target.value)}
                  placeholder="e.g. Premium Dog Food" className={inp} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Badge Text</label>
                  <input type="text" value={form.badge} onChange={e => setField("badge", e.target.value)}
                    placeholder="e.g. 🔥 Flash Deal" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Emoji</label>
                  <input type="text" value={form.emoji} onChange={e => setField("emoji", e.target.value)}
                    placeholder="🎁" className={inp} />
                </div>
              </div>

              <div>
                <label className={lbl}>Gradient Colors</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.gradientFrom} onChange={e => setField("gradientFrom", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-outline-variant/50 cursor-pointer p-0.5 bg-surface-container-low flex-shrink-0" />
                    <input type="text" value={form.gradientFrom} onChange={e => setField("gradientFrom", e.target.value)}
                      className={`${inp} font-mono`} placeholder="#f97316" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.gradientTo} onChange={e => setField("gradientTo", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-outline-variant/50 cursor-pointer p-0.5 bg-surface-container-low flex-shrink-0" />
                    <input type="text" value={form.gradientTo} onChange={e => setField("gradientTo", e.target.value)}
                      className={`${inp} font-mono`} placeholder="#ef4444" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>CTA Label</label>
                  <input type="text" value={form.ctaLabel} onChange={e => setField("ctaLabel", e.target.value)}
                    placeholder="Shop Now" className={inp} />
                </div>
                <div>
                  <label className={lbl}>CTA Link</label>
                  <input type="text" value={form.ctaHref} onChange={e => setField("ctaHref", e.target.value)}
                    placeholder="/marketplace" className={inp} />
                </div>
              </div>

              <div className="flex items-center gap-6 py-1">
                <div className="flex items-center gap-2">
                  <Toggle checked={form.showOnLandingPage} onChange={() => setField("showOnLandingPage", !form.showOnLandingPage)} />
                  <label className="text-xs text-on-surface font-medium cursor-pointer" onClick={() => setField("showOnLandingPage", !form.showOnLandingPage)}>
                    Show on Landing Page
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle checked={form.active} onChange={() => setField("active", !form.active)} />
                  <label className="text-xs text-on-surface font-medium cursor-pointer" onClick={() => setField("active", !form.active)}>
                    Active
                  </label>
                </div>
              </div>

              {formError && <p className="text-xs text-error">{formError}</p>}
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer bg-transparent">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={formSaving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {formSaving ? <IconSpinner size={13} className="animate-spin" /> : <IconCheck size={13} weight="bold" />}
                {modal.mode === "add" ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
