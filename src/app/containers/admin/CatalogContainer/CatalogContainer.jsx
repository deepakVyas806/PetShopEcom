"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  IconAdd, IconEdit, IconDelete, IconClose,
  IconCheck, IconSpinner, IconChevronRight,
} from "@/lib/icons";

function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const TAB_TYPES = [
  { key: "category",  label: "Categories",  plural: "categories",  addLabel: "Add Category"  },
  { key: "brand",     label: "Brands",       plural: "brands",      addLabel: "Add Brand"     },
  { key: "petType",   label: "Pet Types",    plural: "pet types",   addLabel: "Add Pet Type"  },
  { key: "lifeStage", label: "Life Stages",  plural: "life stages", addLabel: "Add Life Stage" },
  { key: "tag",       label: "Tags",         plural: "tags",        addLabel: "Add Tag"       },
  { key: "badge",     label: "Badges",       plural: "badges",      addLabel: "Add Badge"     },
];

const EMPTY_FORM = { name: "", icon: "", slug: "", color: "", logoUrl: "" };

const inp = "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant";
const lbl = "block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5";

export default function CatalogContainer() {
  const [activeType,  setActiveType]  = useState("category");
  const [items,       setItems]       = useState({});
  const [loading,     setLoading]     = useState({});
  const [savingId,    setSavingId]    = useState(null);
  const [modal,       setModal]       = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formError,   setFormError]   = useState("");
  const [formSaving,  setFormSaving]  = useState(false);
  const [deleteId,    setDeleteId]    = useState(null);

  // Ref guard: tracks which types have been fetched to prevent double-fetching in StrictMode.
  const fetchedRef = useRef(new Set());

  const fetchType = useCallback(async (type, force = false) => {
    if (!force && fetchedRef.current.has(type)) return;
    fetchedRef.current.add(type);
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const data = await api.get(`/admin/catalog?type=${type}`);
      setItems(prev => ({ ...prev, [type]: data.items ?? [] }));
    } catch {}
    finally { setLoading(prev => ({ ...prev, [type]: false })); }
  }, []);

  // Lazy-load: only fetch the active tab when it changes (other tabs load on first visit).
  useEffect(() => {
    fetchType(activeType);
  }, [activeType, fetchType]);

  const openAdd = (type) => {
    setForm(EMPTY_FORM);
    setFormError("");
    setModal({ mode: "add", type });
  };

  const openEdit = (type, item) => {
    setForm({
      name:    item.name    ?? "",
      icon:    item.icon    ?? "",
      slug:    item.slug    ?? "",
      color:   item.color   ?? "",
      logoUrl: item.logoUrl ?? "",
    });
    setFormError("");
    setModal({ mode: "edit", type, item });
  };

  const closeModal = () => { setModal(null); setFormError(""); };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    setFormSaving(true);
    setFormError("");
    try {
      const body = { ...form, type: modal.type, slug: form.slug || toSlug(form.name) };
      if (modal.mode === "add") {
        await api.post("/admin/catalog", body);
      } else {
        await api.put(`/admin/catalog/${modal.item._id}`, body);
      }
      await fetchType(modal.type, true);
      closeModal();
    } catch (e) {
      setFormError(e.message ?? "Failed to save.");
    }
    setFormSaving(false);
  };

  const handleDelete = async (type, id) => {
    setDeleteId(id);
    try {
      await api.delete(`/admin/catalog/${id}`);
      setItems(prev => ({ ...prev, [type]: (prev[type] ?? []).filter(i => i._id !== id) }));
    } catch {}
    setDeleteId(null);
  };

  const handleToggle = async (type, item) => {
    setSavingId(item._id);
    try {
      const data = await api.patch(`/admin/catalog/${item._id}/toggle`);
      setItems(prev => ({
        ...prev,
        [type]: (prev[type] ?? []).map(i => i._id === item._id ? data.item : i),
      }));
    } catch {}
    setSavingId(null);
  };

  const currentItems = items[activeType] ?? [];
  const currentTab   = TAB_TYPES.find(t => t.key === activeType);
  const isLoading    = loading[activeType];

  return (
    <div className="space-y-5 pb-12">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1 text-[10px] text-on-surface-variant mb-1.5">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <IconChevronRight size={11} />
            <span className="text-primary font-semibold">Catalog</span>
          </nav>
          <h1 className="text-sm font-bold text-on-surface">Catalog Management</h1>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Define categories, brands, pet types, life stages, tags, and badges — the master data used across the entire store.
          </p>
        </div>
        <button
          onClick={() => openAdd(activeType)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none flex-shrink-0"
        >
          <IconAdd size={13} weight="bold" />
          {currentTab?.addLabel}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-outline-variant/20 overflow-x-auto scrollbar-none">
        {TAB_TYPES.map(({ key, label }) => {
          const count = (items[key] ?? []).length;
          const active = key === activeType;
          return (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-all cursor-pointer bg-transparent border-t-0 border-l-0 border-r-0 ${
                active ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
              {!loading[key] && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">

        {/* Table header */}
        <div className="grid gap-3 px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/20 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant"
          style={{ gridTemplateColumns: activeType === "brand" ? "1fr 120px 160px 52px 68px" : "1fr 160px 52px 68px" }}>
          <span>Name</span>
          {activeType === "brand" && <span>Logo</span>}
          <span>Slug</span>
          <span className="text-center">Live</span>
          <span />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <IconSpinner size={20} className="text-primary animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && currentItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm font-bold text-on-surface-variant">No {currentTab?.plural} yet</p>
            <button
              onClick={() => openAdd(activeType)}
              className="text-xs text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none"
            >
              + {currentTab?.addLabel}
            </button>
          </div>
        )}

        {/* Rows */}
        {!isLoading && currentItems.map(item => (
          <div
            key={item._id}
            className="grid gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/40 group transition-colors items-center"
            style={{ gridTemplateColumns: activeType === "brand" ? "1fr 120px 160px 52px 68px" : "1fr 160px 52px 68px" }}
          >
            {/* Name + icon */}
            <div className="flex items-center gap-2.5 min-w-0">
              {item.icon && <span className="text-xl flex-shrink-0">{item.icon}</span>}
              {!item.icon && activeType === "tag" && item.color && (
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">{item.name}</p>
                {activeType === "badge" && item.color && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5" style={{ background: item.color + "22", color: item.color, border: `1px solid ${item.color}44` }}>
                    preview
                  </span>
                )}
              </div>
            </div>

            {/* Brand logo */}
            {activeType === "brand" && (
              item.logoUrl
                ? <img src={item.logoUrl} alt={item.name} className="w-8 h-8 object-contain rounded-lg border border-outline-variant/20" />
                : <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant border border-outline-variant/20">
                    {item.name.slice(0, 2).toUpperCase()}
                  </span>
            )}

            {/* Slug */}
            <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg truncate">
              {item.slug}
            </span>

            {/* Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => handleToggle(activeType, item)}
                disabled={savingId === item._id}
                className={`relative rounded-full transition-colors cursor-pointer border-none flex-shrink-0 disabled:opacity-60 ${item.active ? "bg-primary" : "bg-outline-variant"}`}
                style={{ width: 32, height: 18 }}
                title={item.active ? "Deactivate" : "Activate"}
              >
                <span className={`absolute top-[2px] w-[13px] h-[13px] rounded-full bg-white shadow transition-all ${item.active ? "left-[17px]" : "left-[2px]"}`} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(activeType, item)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer bg-transparent border-none"
                title="Edit"
              >
                <IconEdit size={13} weight="bold" />
              </button>
              <button
                onClick={() => handleDelete(activeType, item._id)}
                disabled={deleteId === item._id}
                className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all cursor-pointer bg-transparent border-none disabled:opacity-50"
                title="Delete"
              >
                {deleteId === item._id
                  ? <IconSpinner size={13} className="animate-spin" />
                  : <IconDelete size={13} weight="bold" />}
              </button>
            </div>
          </div>
        ))}

        {/* Inline add row at bottom (when not using modal) */}
        {!isLoading && (
          <div className="px-4 py-3 bg-surface-container-low border-t border-outline-variant/10 flex items-center gap-2">
            <button
              onClick={() => openAdd(activeType)}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              <IconAdd size={12} weight="bold" />
              {currentTab?.addLabel}
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-on-surface">
                {modal.mode === "add" ? currentTab?.addLabel : `Edit ${currentTab?.label.slice(0, -1)}`}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer bg-transparent border-none"
              >
                <IconClose size={16} weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className={lbl}>Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={
                    modal.type === "category"  ? "e.g. Grooming"
                    : modal.type === "brand"   ? "e.g. Royal Canin"
                    : modal.type === "petType" ? "e.g. Dogs"
                    : modal.type === "lifeStage" ? "e.g. Puppy / Kitten"
                    : modal.type === "tag"     ? "e.g. Organic"
                    : "e.g. Bestseller"
                  }
                  className={inp}
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                />
              </div>

              {/* Icon (emoji) */}
              <div>
                <label className={lbl}>Icon <span className="text-on-surface-variant normal-case font-normal">(emoji, optional)</span></label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  placeholder="e.g. 🐕"
                  className={inp}
                />
              </div>

              {/* Brand logo URL */}
              {modal.type === "brand" && (
                <div>
                  <label className={lbl}>Logo URL <span className="text-on-surface-variant normal-case font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                    placeholder="https://..."
                    className={inp}
                  />
                  {form.logoUrl && (
                    <img src={form.logoUrl} alt="" className="mt-2 w-10 h-10 rounded-lg object-contain border border-outline-variant/30" />
                  )}
                </div>
              )}

              {/* Color (tags / badges) */}
              {(modal.type === "tag" || modal.type === "badge") && (
                <div>
                  <label className={lbl}>Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color || "#6D28D9"}
                      onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-outline-variant/50 cursor-pointer p-0.5 bg-surface-container-low"
                    />
                    <input
                      type="text"
                      value={form.color}
                      onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      placeholder="#6D28D9"
                      className={`${inp} font-mono`}
                    />
                  </div>
                </div>
              )}

              {/* Slug (computed, read-only) */}
              <div>
                <label className={lbl}>Slug <span className="text-on-surface-variant normal-case font-normal">(auto-generated)</span></label>
                <input
                  type="text"
                  value={form.slug || toSlug(form.name)}
                  readOnly
                  className={`${inp} opacity-60 cursor-not-allowed font-mono`}
                />
              </div>

              {formError && <p className="text-xs text-error">{formError}</p>}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={formSaving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {formSaving
                  ? <IconSpinner size={13} className="animate-spin" />
                  : <IconCheck size={13} weight="bold" />}
                {modal.mode === "add" ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
