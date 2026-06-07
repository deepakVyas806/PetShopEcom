"use client";
import { memo, useState, useCallback } from "react";
import { IconCalendar, IconEdit, IconDelete, IconAdd, IconCheck, IconClose } from "@/lib/icons";
import { DAYS_OF_WEEK } from "../../data";

function fmtTime(t) {
  if (!t) return "--:--";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

let _hid = 100;

export default memo(function AvailabilityCard({ form, setField }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft]         = useState(null);

  const startEdit = useCallback((row) => {
    setEditingId(row.id);
    setDraft({ day: row.day, start: row.start, end: row.end });
  }, []);

  const saveEdit = useCallback(() => {
    setField(
      "operatingHours",
      form.operatingHours.map((r) =>
        r.id === editingId ? { id: r.id, day: draft.day, start: draft.start, end: draft.end } : r
      )
    );
    setEditingId(null);
    setDraft(null);
  }, [editingId, draft, form.operatingHours, setField]);

  const cancelEdit = useCallback(() => {
    const row = form.operatingHours.find((r) => r.id === editingId);
    if (row?._new) {
      setField("operatingHours", form.operatingHours.filter((r) => r.id !== editingId));
    }
    setEditingId(null);
    setDraft(null);
  }, [editingId, form.operatingHours, setField]);

  const deleteRow = useCallback((id) => {
    setField("operatingHours", form.operatingHours.filter((r) => r.id !== id));
    if (editingId === id) { setEditingId(null); setDraft(null); }
  }, [form.operatingHours, setField, editingId]);

  const addHours = useCallback(() => {
    const id = ++_hid;
    const newRow = { id, day: "Monday", start: "09:00", end: "17:00", _new: true };
    setField("operatingHours", [...form.operatingHours, newRow]);
    setEditingId(id);
    setDraft({ day: "Monday", start: "09:00", end: "17:00" });
  }, [form.operatingHours, setField]);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconCalendar size={16} className="text-primary" weight="duotone" />
          <h3 className="text-xs font-bold text-on-surface">Availability &amp; Scheduling</h3>
        </div>
        <button
          type="button"
          className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
        >
          Edit Full Calendar
        </button>
      </div>

      <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 space-y-2">
        {form.operatingHours.length === 0 && editingId === null && (
          <p className="text-[10px] text-on-surface-variant text-center py-3">
            No operating hours set. Click below to add slots.
          </p>
        )}

        {form.operatingHours.map((row) =>
          editingId === row.id ? (
            /* ── Edit row ── */
            <div key={row.id} className="p-3 bg-surface rounded-xl border border-primary/30 shadow-sm space-y-3">
              <p className="text-[10px] font-semibold text-on-surface-variant">Edit hours</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <select
                    value={draft.day}
                    onChange={(e) => setDraft((d) => ({ ...d, day: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-[10px] text-on-surface focus:outline-none focus:border-primary cursor-pointer appearance-none pr-6"
                  >
                    {DAYS_OF_WEEK.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-on-surface-variant">▾</span>
                </div>
                <div>
                  <input
                    type="time"
                    value={draft.start}
                    onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-[10px] text-on-surface focus:outline-none focus:border-primary"
                  />
                  <p className="text-[9px] text-on-surface-variant mt-0.5 text-center">Open</p>
                </div>
                <div>
                  <input
                    type="time"
                    value={draft.end}
                    onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-[10px] text-on-surface focus:outline-none focus:border-primary"
                  />
                  <p className="text-[9px] text-on-surface-variant mt-0.5 text-center">Close</p>
                </div>
              </div>
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-1 px-3 py-1 text-[10px] font-semibold text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <IconClose size={10} weight="bold" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="flex items-center gap-1 px-3 py-1 text-[10px] font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  <IconCheck size={10} weight="bold" /> Save
                </button>
              </div>
            </div>
          ) : (
            /* ── Display row ── */
            <div
              key={row.id}
              className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/30 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-on-surface w-20 flex-shrink-0">{row.day}</span>
                <span className="text-[10px] text-on-surface-variant">
                  {fmtTime(row.start)} — {fmtTime(row.end)}
                </span>
              </div>
              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                >
                  <IconEdit size={13} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteRow(row.id)}
                  className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                >
                  <IconDelete size={13} weight="bold" />
                </button>
              </div>
            </div>
          )
        )}

        {/* Add button */}
        <button
          type="button"
          onClick={addHours}
          className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-[10px] font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
        >
          <IconAdd size={13} weight="bold" /> Add Operating Hours
        </button>
      </div>
    </div>
  );
});
