"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconAdd, IconFilter } from "@/lib/icons";
import StatCards            from "./Components/StatCards";
import ServicesTable        from "./Components/ServicesTable";
import PromotionalCalendar  from "./Components/PromotionalCalendar";
import DeleteConfirmModal   from "./Components/DeleteConfirmModal";
import { SERVICES, AVG_TICKET, CAPACITY_UTIL } from "./data";

const PER_PAGE = 8;

export default function ServicesContainer() {
  const router = useRouter();
  const [services,      setServices]      = useState(SERVICES);
  const [selectedIds,   setSelectedIds]   = useState(new Set());
  const [selectAll,     setSelectAll]     = useState(false);
  const [page,          setPage]          = useState(1);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  // deleteTarget shape: { type: "single", service } | { type: "bulk", count }

  const featuredCount = useMemo(() => services.filter((s) => s.featured).length,                        [services]);
  const activeCount   = useMemo(() => services.filter((s) => s.availability !== "unavailable").length,  [services]);
  const paginated     = useMemo(() => services.slice((page - 1) * PER_PAGE, page * PER_PAGE),           [services, page]);

  // ── Selection ──────────────────────────────────────────────────────────────
  const handleSelectAll = useCallback(() => {
    setSelectAll((prev) => {
      const next = !prev;
      setSelectedIds(next ? new Set(paginated.map((s) => s.id)) : new Set());
      return next;
    });
  }, [paginated]);

  const handleSelectRow = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectAll(next.size === paginated.length && paginated.length > 0);
      return next;
    });
  }, [paginated]);

  // ── Featured toggle ────────────────────────────────────────────────────────
  const handleToggleFeatured = useCallback((id) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s)));
  }, []);

  // ── Row menu actions ───────────────────────────────────────────────────────
  const handleMenuAction = useCallback((action, service) => {
    switch (action) {
      case "edit":
        router.push(`/admin/services/${service.id}/edit`);
        break;
      case "toggleFeatured":
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, featured: !s.featured } : s))
        );
        break;
      case "toggleAvailability":
        setServices((prev) =>
          prev.map((s) =>
            s.id === service.id
              ? { ...s, availability: s.availability === "instant" ? "waitlist" : "instant" }
              : s
          )
        );
        break;
      case "delete":
        setDeleteTarget({ type: "single", service });
        break;
    }
  }, [router]);

  // ── Bulk delete (opens modal) ─────────────────────────────────────────────
  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setDeleteTarget({ type: "bulk", count: selectedIds.size });
  }, [selectedIds]);

  // ── Confirm delete ─────────────────────────────────────────────────────────
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "single") {
      const id = deleteTarget.service.id;
      setServices((prev) => prev.filter((s) => s.id !== id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      setServices((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
      setSelectAll(false);
    }
    setDeleteTarget(null);
  }, [deleteTarget, selectedIds]);

  const cancelDelete = useCallback(() => setDeleteTarget(null), []);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const handlePageChange = useCallback((p) => {
    setPage(p);
    setSelectedIds(new Set());
    setSelectAll(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Action row */}
      <div className="flex justify-end gap-2.5">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
          <IconFilter size={14} weight="bold" /> Filters
        </button>
        <button
          onClick={() => router.push("/admin/services/create")}
          className="flex items-center gap-1.5 px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <IconAdd size={14} weight="bold" /> Add New Service
        </button>
      </div>

      {/* Bento stats */}
      <StatCards
        activeCount={activeCount}
        featuredCount={featuredCount}
        avgTicket={AVG_TICKET}
        capacity={CAPACITY_UTIL}
      />

      {/* Data table */}
      <ServicesTable
        services={paginated}
        total={services.length}
        page={page}
        perPage={PER_PAGE}
        selectedIds={selectedIds}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onToggleFeatured={handleToggleFeatured}
        onMenuAction={handleMenuAction}
        onBulkDelete={handleBulkDelete}
        onPageChange={handlePageChange}
      />

      {/* Promo calendar + analytics widget */}
      <PromotionalCalendar />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        target={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
