"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { IconAdd } from "@/lib/icons";
import { api, qs } from "@/lib/api";
import { SkStatCard, SkTable } from "@/components/ui";
import StatCards         from "./Components/StatCards";
import CouponsTable      from "./Components/CouponsTable";
import SidePanel         from "./Components/SidePanel";
import CreateCouponModal from "./Components/CreateCouponModal";

function toUiCoupon(c) {
  return {
    id:           String(c._id),
    name:         c.name,
    code:         c.code,
    description:  c.description ?? "",
    discountType: c.discountType ?? "percent",
    value:        c.value ?? 0,
    minOrderRaw:  c.minOrder ?? 0,
    usageCount:   c.usageCount ?? 0,
    usageLimit:   c.usageLimit ?? 0,
    startDate:    c.startDate ?? "",
    endDate:      c.endDate ?? "",
    status:       c.status,
    revenueRaw:   c.revenue ?? 0,
  };
}

export default function PromotionsContainer() {
  const [coupons,      setCoupons]      = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(1);
  const [modalCoupon,  setModalCoupon]  = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/promotions${qs({ page, limit: 10, search: search || undefined })}`);
      setCoupons((data.coupons ?? []).map(toUiCoupon));
      setTotal(data.total ?? 0);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      c => c.code.toLowerCase().includes(q) ||
           c.name.toLowerCase().includes(q) ||
           c.description.toLowerCase().includes(q)
    );
  }, [coupons, search]);

  const openCreate = useCallback(() => { setModalCoupon(null); setShowModal(true); }, []);
  const openEdit   = useCallback((coupon) => { setModalCoupon(coupon); setShowModal(true); }, []);
  const closeModal = useCallback(() => { setShowModal(false); setModalCoupon(null); }, []);

  const handleSave = useCallback(async (formData) => {
    const payload = {
      name:         formData.name,
      code:         formData.code,
      description:  formData.description,
      discountType: formData.discountType,
      value:        formData.value,
      minOrder:     formData.minOrderRaw,
      usageLimit:   formData.usageLimit,
      startDate:    formData.startDate,
      endDate:      formData.endDate,
      status:       formData.status ?? "active",
    };
    try {
      if (formData.id) {
        const data = await api.put(`/admin/promotions/${formData.id}`, payload);
        setCoupons(prev => prev.map(c => c.id === formData.id ? toUiCoupon(data.coupon) : c));
      } else {
        const data = await api.post("/admin/promotions", payload);
        setCoupons(prev => [toUiCoupon(data.coupon), ...prev]);
      }
    } catch {}
    closeModal();
  }, [closeModal]);

  const handleToggle = useCallback(async (id) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;
    const next = coupon.status === "active" ? "paused" : "active";
    try { await api.put(`/admin/promotions/${id}`, { status: next }); } catch {}
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: next } : c));
  }, [coupons]);

  const handleDuplicate = useCallback(async (coupon) => {
    const payload = {
      name:         coupon.name + " (Copy)",
      code:         coupon.code + "-COPY",
      description:  coupon.description,
      discountType: coupon.discountType,
      value:        coupon.value,
      minOrder:     coupon.minOrderRaw,
      usageLimit:   coupon.usageLimit,
      startDate:    coupon.startDate,
      endDate:      coupon.endDate,
      status:       "paused",
    };
    try {
      const data = await api.post("/admin/promotions", payload);
      setCoupons(prev => [toUiCoupon(data.coupon), ...prev]);
    } catch {}
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try { await api.delete(`/admin/promotions/${deleteTarget.id}`); } catch {}
    setCoupons(prev => prev.filter(c => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget]);

  const isInitial = loading && coupons.length === 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by code, name or description…"
            className="flex-1 min-w-[220px] bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ml-auto"
          >
            <IconAdd size={14} weight="bold" /> Create New Coupon
          </button>
        </div>

        {isInitial ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkStatCard key={i} />)}
          </div>
        ) : (
          <StatCards coupons={coupons} />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8">
            {isInitial ? (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden overflow-x-auto">
                <SkTable rows={8} cols={5} hasCheckbox={false} />
              </div>
            ) : (
              <CouponsTable
                coupons={displayed}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDuplicate={handleDuplicate}
                onDelete={setDeleteTarget}
              />
            )}
          </div>
          <div className="xl:col-span-4">
            <SidePanel />
          </div>
        </div>
      </div>

      {showModal && (
        <CreateCouponModal
          coupon={modalCoupon}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface rounded-2xl w-full max-w-sm shadow-2xl border border-outline-variant/30 overflow-hidden">
            <div className="h-1 bg-error" />
            <div className="p-6 space-y-4">
              <p className="text-xs font-bold text-on-surface">Delete Coupon?</p>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Delete <span className="font-bold text-primary font-mono">{deleteTarget.code}</span>?
                This action cannot be undone. Any active promotions using this code will stop working immediately.
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-error text-on-error hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Delete Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
