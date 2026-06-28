"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconAdd, IconFilter } from "@/lib/icons";
import { SkStatCard, SkTable } from "@/components/ui";
import { api, qs } from "@/lib/api";
import { fmt } from "@/lib/currency";
import StatCards           from "./Components/StatCards";
import ServicesTable       from "./Components/ServicesTable";
import PromotionalCalendar from "./Components/PromotionalCalendar";
import DeleteConfirmModal  from "./Components/DeleteConfirmModal";

const PER_PAGE = 8;

function toUiService(s) {
  return {
    id:           String(s._id),
    name:         s.name,
    category:     s.category,
    icon:         s.badge ?? "🐾",
    target:       s.petTypes ?? [],
    price:        fmt(s.price ?? 0),
    priceRaw:     s.price ?? 0,
    duration:     s.duration ?? "—",
    capacity:     s.capacity ?? 0,
    bookings:     0,
    rating:       s.rating ?? 0,
    featured:     s.featured ?? false,
    active:       s.active ?? true,
    availability: s.availability ?? "instant",
    image:        s.image ?? "",
  };
}

export default function ServicesContainer() {
  const router = useRouter();

  const [services,     setServices]     = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [selectedIds,  setSelectedIds]  = useState(new Set());
  const [selectAll,    setSelectAll]    = useState(false);
  const [page,         setPage]         = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/services${qs({ page, limit: PER_PAGE })}`);
      setServices((data.services ?? []).map(toUiService));
      setTotal(data.total ?? 0);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const featuredCount = useMemo(() => services.filter(s => s.featured).length,                       [services]);
  const activeCount   = useMemo(() => services.filter(s => s.active).length,    [services]);
  const paginated     = services; // already paginated by server

  const handleSelectAll = useCallback(() => {
    setSelectAll(prev => {
      const next = !prev;
      setSelectedIds(next ? new Set(paginated.map(s => s.id)) : new Set());
      return next;
    });
  }, [paginated]);

  const handleSelectRow = useCallback((id) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const handleToggleFeatured = useCallback(async (id) => {
    const svc = services.find(s => s.id === id);
    if (!svc) return;
    try { await api.put(`/admin/services/${id}`, { featured: !svc.featured }); } catch {}
    setServices(prev => prev.map(s => s.id === id ? { ...s, featured: !s.featured } : s));
  }, [services]);

  const handleMenuAction = useCallback((action, service) => {
    switch (action) {
      case "edit":
        router.push(`/admin/services/${service.id}/edit`);
        break;
      case "toggleFeatured":
        handleToggleFeatured(service.id);
        break;
      case "toggleAvailability": {
        const next = service.availability === "instant" ? "waitlist" : "instant";
        api.put(`/admin/services/${service.id}`, { availability: next }).catch(() => {});
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, availability: next } : s));
        break;
      }
      case "delete":
        setDeleteTarget({ type: "single", service });
        break;
    }
  }, [router, handleToggleFeatured]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setDeleteTarget({ type: "bulk", count: selectedIds.size });
  }, [selectedIds]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "single") {
      try { await api.delete(`/admin/services/${deleteTarget.service.id}`); } catch {}
    } else {
      await Promise.allSettled([...selectedIds].map(id => api.delete(`/admin/services/${id}`)));
      setSelectedIds(new Set());
      setSelectAll(false);
    }
    setDeleteTarget(null);
    fetchServices();
  }, [deleteTarget, selectedIds, fetchServices]);

  const handlePageChange = useCallback((p) => {
    setPage(p); setSelectedIds(new Set()); setSelectAll(false);
  }, []);

  const isInitial = loading && services.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2.5">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
          <IconFilter size={14} weight="bold" /> Filters
        </button>
        <button
          onClick={() => router.push("/admin/services/create")}
          className="flex items-center gap-1.5 px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-brand-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <IconAdd size={14} weight="bold" /> Add New Service
        </button>
      </div>

      {isInitial ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkStatCard key={i} />)}
        </div>
      ) : (
        <StatCards
          activeCount={activeCount}
          featuredCount={featuredCount}
          avgTicket="—"
          capacity="—"
        />
      )}

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card-sm overflow-hidden">
        {isInitial ? (
          <div className="overflow-x-auto">
            <SkTable rows={8} cols={5} hasCheckbox hasAvatar />
          </div>
        ) : (
          <ServicesTable
            services={paginated}
            total={total}
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
        )}
      </div>

      <PromotionalCalendar />

      <DeleteConfirmModal
        target={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
