"use client";
import { useState, useCallback } from "react";
import { IconClock, IconAdd, IconClose, IconCalendarAdd } from "@/lib/icons";
import { PROMO_EVENTS } from "../data";

const THEME = {
  primary: {
    wrapper: "bg-primary-fixed",
    title:   "text-on-primary-fixed",
    desc:    "text-on-primary-fixed/70",
    badge:   "bg-white/30 text-on-primary-fixed",
    label:   "Purple",
    swatch:  "bg-primary-fixed",
  },
  tertiary: {
    wrapper: "bg-tertiary-fixed",
    title:   "text-on-tertiary-fixed",
    desc:    "text-on-tertiary-fixed/70",
    badge:   "bg-white/30 text-on-tertiary-fixed",
    label:   "Teal",
    swatch:  "bg-tertiary-fixed",
  },
  secondary: {
    wrapper: "bg-secondary-fixed",
    title:   "text-on-secondary-fixed",
    desc:    "text-on-secondary-fixed/70",
    badge:   "bg-white/30 text-on-secondary-fixed",
    label:   "Lilac",
    swatch:  "bg-secondary-fixed",
  },
};

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function fmtDateRange(startStr, endStr) {
  const s = new Date(startStr + "T00:00:00");
  const e = new Date(endStr   + "T00:00:00");
  const sm = MONTHS[s.getMonth()], em = MONTHS[e.getMonth()];
  const sd = String(s.getDate()).padStart(2, "0");
  const ed = String(e.getDate()).padStart(2, "0");
  return sm === em ? `${sm} ${sd}–${ed}` : `${sm} ${sd} – ${em} ${ed}`;
}

const EMPTY = { title: "", desc: "", theme: "primary", startDate: "", endDate: "" };
let _pid = 10;

export default function PromotionalCalendar() {
  // Seed static events with IDs so removal works
  const [events,    setEvents]    = useState(() => PROMO_EVENTS.map((e, i) => ({ ...e, id: i + 1 })));
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [error,     setError]     = useState("");

  const setField = useCallback((k, v) => setForm((p) => ({ ...p, [k]: v })), []);

  const openModal = useCallback(() => {
    setForm({ ...EMPTY });
    setError("");
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);

  const handleSave = useCallback(() => {
    if (!form.title.trim())                    { setError("Promotion name is required.");             return; }
    if (!form.desc.trim())                     { setError("Tagline is required.");                    return; }
    if (!form.startDate)                       { setError("Start date is required.");                 return; }
    if (!form.endDate)                         { setError("End date is required.");                   return; }
    if (form.endDate < form.startDate)         { setError("End date must be after start date.");      return; }

    setEvents((prev) => [
      ...prev,
      {
        id:    ++_pid,
        title: form.title.trim(),
        desc:  form.desc.trim(),
        dates: fmtDateRange(form.startDate, form.endDate),
        theme: form.theme,
      },
    ]);
    setShowModal(false);
  }, [form]);

  const removeEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <>
      {/* ── Promotional Calendar panel ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-on-surface">Promotional Calendar</h4>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {events.length} promotion{events.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-xl text-[10px] font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <IconAdd size={12} weight="bold" /> Add Promotion
          </button>
        </div>

        {events.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2.5 text-on-surface-variant">
            <IconCalendarAdd size={36} weight="duotone" className="opacity-25" />
            <p className="text-[10px] font-medium">No promotions scheduled yet.</p>
            <button
              type="button"
              onClick={openModal}
              className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
            >
              Add your first promotion →
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mb-2">
            {events.map((ev) => {
              const t = THEME[ev.theme] ?? THEME.primary;
              return (
                <div
                  key={ev.id}
                  className={`relative flex-shrink-0 w-44 p-4 rounded-2xl group ${t.wrapper}`}
                >
                  {/* Hover-reveal remove button */}
                  <button
                    type="button"
                    onClick={() => removeEvent(ev.id)}
                    title="Remove promotion"
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/10 hover:bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <IconClose size={9} weight="bold" className={t.title} />
                  </button>

                  <p className={`text-xs font-bold pr-5 leading-snug ${t.title}`}>{ev.title}</p>
                  <p className={`text-[10px] mt-1 leading-snug ${t.desc}`}>{ev.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${t.badge}`}>
                      {ev.dates}
                    </span>
                    <IconClock size={13} className={t.title} weight="bold" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Promotion Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative bg-surface rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30 overflow-hidden">
            <div className="h-1 bg-primary" />

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-on-surface">New Promotion</p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <IconClose size={14} weight="bold" />
                </button>
              </div>

              {/* Promotion name */}
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  Promotion Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g., Summer Spa Sale"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                  Short Tagline <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.desc}
                  onChange={(e) => setField("desc", e.target.value)}
                  placeholder="e.g., 20% off all grooming services"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                    Start Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant mb-1.5">
                    End Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Theme picker */}
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-2">
                  Card Colour
                </label>
                <div className="flex gap-2">
                  {Object.entries(THEME).map(([key, t]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setField("theme", key)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${t.wrapper} ${t.title} ${
                        form.theme === key
                          ? "ring-2 ring-offset-2 ring-primary scale-[1.04] shadow-md"
                          : "opacity-60 hover:opacity-90"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              {(form.title || form.desc) && (
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant mb-2">Preview</label>
                  <div className={`inline-block w-44 p-4 rounded-2xl ${THEME[form.theme].wrapper}`}>
                    <p className={`text-xs font-bold leading-snug ${THEME[form.theme].title}`}>
                      {form.title || "Promotion Name"}
                    </p>
                    <p className={`text-[10px] mt-1 ${THEME[form.theme].desc}`}>
                      {form.desc || "Short tagline"}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${THEME[form.theme].badge}`}>
                        {form.startDate && form.endDate ? fmtDateRange(form.startDate, form.endDate) : "DATE RANGE"}
                      </span>
                      <IconClock size={13} className={THEME[form.theme].title} weight="bold" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-[10px] text-error font-semibold">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Add Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
