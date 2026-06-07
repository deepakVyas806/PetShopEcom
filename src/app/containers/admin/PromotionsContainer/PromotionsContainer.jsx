"use client";
import { useState, useMemo, useCallback } from "react";
import { IconAdd } from "@/lib/icons";
import { fmt } from "@/lib/currency";
import StatCards          from "./Components/StatCards";
import CouponsTable       from "./Components/CouponsTable";
import SidePanel          from "./Components/SidePanel";
import CreateCouponModal  from "./Components/CreateCouponModal";
import { COUPONS, STATUS_META, discountLabel, nextCouponId } from "./data";

export default function PromotionsContainer() {
  const [coupons,      setCoupons]      = useState(COUPONS);
  const [search,       setSearch]       = useState("");
  const [modalCoupon,  setModalCoupon]  = useState(null);   // null=closed, {}=create, {id}=edit
  const [showModal,    setShowModal]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [coupons, search]);

  // ── Modal handlers ────────────────────────────────────────────────────────
  const openCreate = useCallback(() => { setModalCoupon(null); setShowModal(true); }, []);
  const openEdit   = useCallback((coupon) => { setModalCoupon(coupon); setShowModal(true); }, []);
  const closeModal = useCallback(() => { setShowModal(false); setModalCoupon(null); }, []);

  const handleSave = useCallback((data) => {
    if (data.id) {
      setCoupons((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
    } else {
      setCoupons((prev) => [
        { ...data, id: nextCouponId(), usageCount: 0, revenueRaw: 0 },
        ...prev,
      ]);
    }
    closeModal();
  }, [closeModal]);

  // ── Toggle pause/activate ─────────────────────────────────────────────────
  const handleToggle = useCallback((id) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
  }, []);

  // ── Duplicate ─────────────────────────────────────────────────────────────
  const handleDuplicate = useCallback((coupon) => {
    setCoupons((prev) => [
      {
        ...coupon,
        id:         nextCouponId(),
        code:       coupon.code + "-COPY",
        name:       coupon.name + " (Copy)",
        status:     "paused",
        usageCount: 0,
        revenueRaw: 0,
      },
      ...prev,
    ]);
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget]);

  return (
    <>
      <div className="space-y-6">
        {/* Action row */}
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {/* Stats */}
        <StatCards coupons={coupons} />

        {/* 12-col bento */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-8">
            <CouponsTable
              coupons={displayed}
              onEdit={openEdit}
              onToggle={handleToggle}
              onDuplicate={handleDuplicate}
              onDelete={setDeleteTarget}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <SidePanel />
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <CreateCouponModal
          coupon={modalCoupon}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* Delete confirm */}
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
