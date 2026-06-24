"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  IconAdd, IconEdit, IconDelete, IconClose,
  IconCheck, IconSpinner, IconChevronRight, IconChevronUp, IconChevronDown,
} from "@/lib/icons";
import ImageUploadField from "@/components/admin/ImageUploadField";

const DEFAULT_OVERLAY_LEFT  = "linear-gradient(to right, rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)";
const DEFAULT_OVERLAY_RIGHT = "linear-gradient(to left,  rgba(21,28,39,0.80) 0%, rgba(21,28,39,0.35) 55%, transparent 100%)";

const EMPTY_FORM = {
  badge:       "",
  badgeEmoji:  "🐾",
  headline:    "",
  subtitle:    "",
  imageUrl:    "",
  overlay:     DEFAULT_OVERLAY_LEFT,
  contentSide: "left",
  ctaLabel:    "Shop Now",
  ctaHref:     "/marketplace",
  cta2Label:   "",
  cta2Href:    "",
  active:      true,
  order:       0,
};

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

function SlidePreview({ slide }) {
  const isRight = slide.contentSide === "right";
  return (
    <div
      className="relative rounded-xl overflow-hidden flex items-center"
      style={{ aspectRatio: "16/5", minHeight: 80 }}
    >
      {slide.imageUrl && (
        <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      )}
      {!slide.imageUrl && <div className="absolute inset-0 bg-surface-container" />}
      <div className="absolute inset-0" style={{ background: slide.overlay || DEFAULT_OVERLAY_LEFT }} />
      <div className={`absolute inset-0 flex items-center px-4 ${isRight ? "justify-end" : ""}`}>
        <div className={`text-white max-w-xs ${isRight ? "text-right" : ""}`}>
          {slide.badge && (
            <span className={`inline-flex items-center gap-1 bg-white/15 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-wider mb-1 w-fit ${isRight ? "ml-auto" : ""} block`}>
              {slide.badgeEmoji} {slide.badge}
            </span>
          )}
          <p className="text-xs font-extrabold leading-snug whitespace-pre-line drop-shadow-sm">{slide.headline || "Headline"}</p>
          {slide.subtitle && <p className="text-[9px] text-white/80 mt-0.5">{slide.subtitle}</p>}
          <div className={`flex items-center gap-1.5 mt-1.5 ${isRight ? "justify-end" : ""}`}>
            <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{slide.ctaLabel || "Shop Now"}</span>
            {slide.cta2Label && <span className="bg-white/15 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/30">{slide.cta2Label}</span>}
          </div>
        </div>
      </div>
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

function ContentSidePicker({ value, onChange }) {
  return (
    <div>
      <label className={lbl}>Content Placement</label>
      <div className="flex gap-2">
        {["left", "right"].map(side => (
          <button
            key={side}
            type="button"
            onClick={() => onChange(side)}
            className={`flex-1 py-2 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
              value === side
                ? "bg-primary/10 border-primary text-primary"
                : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline-variant"
            }`}
          >
            {side === "left" ? "◀ Left" : "Right ▶"}
          </button>
        ))}
      </div>
      <p className="text-[9px] text-on-surface-variant mt-1">
        Which side of the banner the headline and buttons appear on.
      </p>
    </div>
  );
}

export default function HeroContainer() {
  const [slides,      setSlides]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formError,   setFormError]   = useState("");
  const [formSaving,  setFormSaving]  = useState(false);
  const [togglingId,  setTogglingId]  = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);
  const fetchedRef = useRef(false);

  const fetchSlides = useCallback(async (force = false) => {
    if (!force && fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const data = await api.get("/admin/hero");
      setSlides(data.slides ?? []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const openAdd = () => {
    const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order ?? 0)) + 1 : 0;
    setForm({ ...EMPTY_FORM, order: nextOrder });
    setFormError("");
    setModal({ mode: "add" });
  };

  const openEdit = (slide) => {
    setForm({
      badge:       slide.badge       ?? "",
      badgeEmoji:  slide.badgeEmoji  ?? "🐾",
      headline:    slide.headline    ?? "",
      subtitle:    slide.subtitle    ?? "",
      imageUrl:    slide.imageUrl    ?? "",
      overlay:     slide.overlay     ?? DEFAULT_OVERLAY_LEFT,
      contentSide: slide.contentSide ?? "left",
      ctaLabel:    slide.ctaLabel    ?? "Shop Now",
      ctaHref:     slide.ctaHref     ?? "/marketplace",
      cta2Label:   slide.cta2Label   ?? "",
      cta2Href:    slide.cta2Href    ?? "",
      active:      slide.active      ?? true,
      order:       slide.order       ?? 0,
    });
    setFormError("");
    setModal({ mode: "edit", slide });
  };

  const closeModal = () => { setModal(null); setFormError(""); };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // When switching content side, auto-flip default overlay if the user hasn't customised it
  const setContentSide = (side) => {
    setForm(f => {
      const isDefaultOverlay = f.overlay === DEFAULT_OVERLAY_LEFT || f.overlay === DEFAULT_OVERLAY_RIGHT;
      return {
        ...f,
        contentSide: side,
        overlay: isDefaultOverlay
          ? (side === "right" ? DEFAULT_OVERLAY_RIGHT : DEFAULT_OVERLAY_LEFT)
          : f.overlay,
      };
    });
  };

  const handleSave = async () => {
    if (!form.headline.trim()) { setFormError("Headline is required."); return; }
    setFormSaving(true);
    setFormError("");
    try {
      if (modal.mode === "add") {
        await api.post("/admin/hero", form);
      } else {
        await api.put(`/admin/hero/${modal.slide._id}`, form);
      }
      await fetchSlides(true);
      closeModal();
    } catch (e) {
      setFormError(e.message ?? "Failed to save.");
    }
    setFormSaving(false);
  };

  const handleToggle = async (slide) => {
    setTogglingId(slide._id);
    try {
      const data = await api.patch(`/admin/hero/${slide._id}/toggle`);
      setSlides(prev => prev.map(s => s._id === slide._id ? data.slide : s));
    } catch {}
    setTogglingId(null);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/admin/hero/${id}`);
      setSlides(prev => prev.filter(s => s._id !== id));
    } catch {}
    setDeleteId(null);
  };

  const handleReorder = async (id, direction) => {
    const idx = slides.findIndex(s => s._id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;

    const updated = [...slides];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    const reordered = updated.map((s, i) => ({ ...s, order: i }));
    setSlides(reordered);

    try {
      await api.patch("/admin/hero/reorder", reordered.map(s => ({ id: s._id, order: s.order })));
    } catch {}
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1 text-[10px] text-on-surface-variant mb-1.5">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <IconChevronRight size={11} />
            <span className="text-primary font-semibold">Hero Slides</span>
          </nav>
          <h1 className="text-sm font-bold text-on-surface">Hero Carousel</h1>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Configure the homepage hero slideshow — slides, images, headlines, buttons, and overlay colors.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none flex-shrink-0"
        >
          <IconAdd size={13} weight="bold" />
          Add Slide
        </button>
      </div>

      {/* Slides list */}
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
            <IconSpinner size={20} className="text-primary animate-spin" />
          </div>
        )}

        {!loading && slides.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
            <p className="text-sm font-bold text-on-surface-variant">No slides yet</p>
            <button onClick={openAdd} className="text-xs text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none">
              + Add Slide
            </button>
          </div>
        )}

        {!loading && slides.map((slide, idx) => (
          <div key={slide._id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden group">
            {/* Preview */}
            <SlidePreview slide={slide} />

            {/* Controls row */}
            <div className="px-4 py-3 flex items-center gap-3 border-t border-outline-variant/10">
              {/* Order buttons */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={() => handleReorder(slide._id, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 cursor-pointer bg-transparent border-none"
                  title="Move up"
                >
                  <IconChevronUp size={12} weight="bold" />
                </button>
                <button
                  onClick={() => handleReorder(slide._id, "down")}
                  disabled={idx === slides.length - 1}
                  className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 cursor-pointer bg-transparent border-none"
                  title="Move down"
                >
                  <IconChevronDown size={12} weight="bold" />
                </button>
              </div>

              {/* Slide info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">{slide.headline}</p>
                <p className="text-[10px] text-on-surface-variant truncate">
                  {slide.badge} {slide.badge && "·"} {slide.contentSide === "right" ? "Content right" : "Content left"} · Slide {idx + 1} of {slides.length}
                </p>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Toggle
                  checked={slide.active}
                  onChange={() => handleToggle(slide)}
                  disabled={togglingId === slide._id}
                />
                <span className="text-[10px] text-on-surface-variant">{slide.active ? "Live" : "Off"}</span>
              </div>

              {/* Edit / Delete */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(slide)}
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer bg-transparent border-none"
                  title="Edit"
                >
                  <IconEdit size={13} weight="bold" />
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  disabled={deleteId === slide._id}
                  className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all cursor-pointer bg-transparent border-none disabled:opacity-50"
                  title="Delete"
                >
                  {deleteId === slide._id
                    ? <IconSpinner size={13} className="animate-spin" />
                    : <IconDelete size={13} weight="bold" />}
                </button>
              </div>
            </div>
          </div>
        ))}
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
                {modal.mode === "add" ? "Add Slide" : "Edit Slide"}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer bg-transparent border-none">
                <IconClose size={16} weight="bold" />
              </button>
            </div>

            {/* Live preview */}
            <div className="mb-5">
              <label className={lbl}>Preview</label>
              <SlidePreview slide={form} />
            </div>

            <div className="space-y-4">
              <div>
                <label className={lbl}>Headline *</label>
                <input type="text" value={form.headline} onChange={e => setField("headline", e.target.value)}
                  placeholder="e.g. Elevated Care for Every Companion" className={inp} autoFocus />
              </div>

              <div>
                <label className={lbl}>Subtitle</label>
                <input type="text" value={form.subtitle} onChange={e => setField("subtitle", e.target.value)}
                  placeholder="Short supporting line below the headline" className={inp} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Badge Text</label>
                  <input type="text" value={form.badge} onChange={e => setField("badge", e.target.value)}
                    placeholder="e.g. Premium Pet Care" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Badge Emoji</label>
                  <input type="text" value={form.badgeEmoji} onChange={e => setField("badgeEmoji", e.target.value)}
                    placeholder="🐾" className={inp} />
                </div>
              </div>

              <ImageUploadField
                label="Background Image"
                value={form.imageUrl}
                onChange={url => setField("imageUrl", url)}
                name={form.headline}
                shape="wide"
                objectFit="cover"
              />

              {/* Content placement + overlay side by side */}
              <ContentSidePicker value={form.contentSide} onChange={setContentSide} />

              <div>
                <label className={lbl}>Overlay <span className="normal-case font-normal text-on-surface-variant">(CSS gradient)</span></label>
                <input type="text" value={form.overlay} onChange={e => setField("overlay", e.target.value)}
                  placeholder="linear-gradient(to right, ...)" className={`${inp} font-mono text-[10px]`} />
                <p className="text-[9px] text-on-surface-variant mt-1">
                  Auto-updated when switching content side. Customise freely.
                </p>
              </div>

              <div>
                <label className={lbl}>Primary Button</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={form.ctaLabel} onChange={e => setField("ctaLabel", e.target.value)}
                    placeholder="Shop Now" className={inp} />
                  <input type="text" value={form.ctaHref} onChange={e => setField("ctaHref", e.target.value)}
                    placeholder="/marketplace" className={inp} />
                </div>
              </div>

              <div>
                <label className={lbl}>Secondary Button <span className="normal-case font-normal text-on-surface-variant">(optional)</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={form.cta2Label} onChange={e => setField("cta2Label", e.target.value)}
                    placeholder="View All Offers" className={inp} />
                  <input type="text" value={form.cta2Href} onChange={e => setField("cta2Href", e.target.value)}
                    placeholder="/marketplace" className={inp} />
                </div>
                <p className="text-[9px] text-on-surface-variant mt-1">Only the label is required to show the button. Href defaults to primary if left empty.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Order</label>
                  <input type="number" value={form.order} onChange={e => setField("order", parseInt(e.target.value) || 0)}
                    className={inp} min={0} />
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2">
                    <Toggle checked={form.active} onChange={() => setField("active", !form.active)} />
                    <label className="text-xs text-on-surface font-medium cursor-pointer" onClick={() => setField("active", !form.active)}>
                      Active (visible on site)
                    </label>
                  </div>
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
