"use client";
import { useState, useCallback, useEffect } from "react";
import { api, qs } from "@/lib/api";
import { fmt } from "@/lib/currency";
import OrdersToolbar     from "./Components/OrdersToolbar";
import OrdersTable       from "./Components/OrdersTable";
import OrdersPagination  from "./Components/OrdersPagination";
import OrderDetailDrawer from "./Components/OrderDetailDrawer";
import StatusUpdateModal from "./Components/StatusUpdateModal";
import { STATUS_OPTIONS } from "./data";
import { SkTable } from "@/components/ui";

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  const diff = Math.floor((Date.now() - date) / 86400000);
  if (diff === 0) return "Today, " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const AVATAR_DEFAULTS = [
  { bg: "bg-primary-fixed",       fg: "text-on-primary-fixed"             },
  { bg: "bg-secondary-container", fg: "text-on-secondary-container"       },
  { bg: "bg-tertiary-container",  fg: "text-on-tertiary-container"        },
  { bg: "bg-surface-container",   fg: "text-on-surface-variant"           },
];

function toUiOrder(o, idx) {
  const def      = AVATAR_DEFAULTS[idx % AVATAR_DEFAULTS.length];
  const name     = o.userId?.name ?? "Customer";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return {
    id:         o.orderId ?? String(o._id),
    _id:        String(o._id),
    customer:   name,
    email:      o.userId?.email  ?? "",
    avatar:     o.userId?.avatar ?? null,
    initials,
    avatarBg:   def.bg,
    avatarFg:   def.fg,
    items:      o.items?.length  ?? 0,
    amount:     fmt(o.total      ?? 0),
    subtotal:   o.subtotal       ?? o.total ?? 0,
    discount:   o.discount       ?? 0,
    couponCode: o.couponCode     ?? null,
    shipping:   o.shipping       ?? 0,
    tax:        o.tax            ?? 0,
    totalRaw:   o.total          ?? 0,
    date:       fmtDate(o.createdAt),
    status:     o.status,
    payment:    o.paymentMethod  ?? "—",
    address:    o.shippingAddress,
    rawItems:   o.items          ?? [],
  };
}

export default function OrdersContainer() {
  const [orders,       setOrders]       = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [dateFilter,   setDateFilter]   = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS[0]);
  const [selectedIds,  setSelectedIds]  = useState(new Set());
  const [selectAll,    setSelectAll]    = useState(false);
  const [page,         setPage]         = useState(1);
  const [detailOrder,  setDetailOrder]  = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/orders${qs({
        page, limit: 10,
        ...(search                                              ? { search }            : {}),
        ...(statusFilter && statusFilter !== STATUS_OPTIONS[0] ? { status: statusFilter } : {}),
      })}`);
      setOrders((data.orders ?? []).map(toUiOrder));
      setTotal(data.total ?? 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSelectAll = useCallback(() => {
    setSelectAll(prev => {
      const next = !prev;
      setSelectedIds(next ? new Set(orders.map(o => o.id)) : new Set());
      return next;
    });
  }, [orders]);

  const handleSelectRow = useCallback((id) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const handlePageChange = useCallback((p) => {
    setPage(p); setSelectedIds(new Set()); setSelectAll(false);
  }, []);

  const applyStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setDetailOrder(d => d?.id === orderId ? { ...d, status } : d);
  }, []);

  const handleStatusConfirm = useCallback(async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    try { await api.put(`/admin/orders/${order._id}/status`, { status: newStatus }); } catch {}
    applyStatus(orderId, newStatus);
    setStatusTarget(null);
  }, [orders, applyStatus]);

  const handleMenuAction = useCallback((action, order) => {
    if (action === "view")   { setDetailOrder(order); return; }
    if (action === "status") { setStatusTarget(order); return; }
    if (action === "cancel") {
      api.put(`/admin/orders/${order._id}/status`, { status: "Cancelled" })
        .then(() => applyStatus(order.id, "Cancelled"))
        .catch(() => {});
    }
  }, [applyStatus]);

  const isInitial = loading && orders.length === 0;

  return (
    <div className="space-y-4">
      <OrdersToolbar
        search={search}
        onSearch={v => { setSearch(v); setPage(1); }}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
        statusFilter={statusFilter}
        onStatusFilter={v => { setStatusFilter(v); setPage(1); }}
        onExport={() => {}}
      />

      <div className="bg-surface-container-lowest rounded-2xl shadow-card-sm border border-outline-variant/30 overflow-hidden">
        {isInitial ? (
          <div className="overflow-x-auto">
            <SkTable rows={10} cols={5} hasCheckbox hasAvatar />
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            selectedIds={selectedIds}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onMenuAction={handleMenuAction}
          />
        )}
        <OrdersPagination
          total={total}
          page={page}
          perPage={10}
          onPageChange={handlePageChange}
        />
      </div>

      {detailOrder && (
        <OrderDetailDrawer
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onUpdateStatus={(order) => setStatusTarget(order)}
        />
      )}

      {statusTarget && (
        <StatusUpdateModal
          order={statusTarget}
          onConfirm={handleStatusConfirm}
          onClose={() => setStatusTarget(null)}
        />
      )}
    </div>
  );
}
