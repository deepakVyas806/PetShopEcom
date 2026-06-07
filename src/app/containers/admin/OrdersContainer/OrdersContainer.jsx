"use client";
import { useState, useMemo, useCallback } from "react";
import OrdersToolbar     from "./Components/OrdersToolbar";
import OrdersTable       from "./Components/OrdersTable";
import OrdersPagination  from "./Components/OrdersPagination";
import OrderDetailDrawer from "./Components/OrderDetailDrawer";
import StatusUpdateModal from "./Components/StatusUpdateModal";
import { ORDERS, STATUS_OPTIONS } from "./data";

const TOTAL_ORDERS = 1240;

export default function OrdersContainer() {
  const [orders,       setOrders]       = useState(ORDERS);
  const [search,       setSearch]       = useState("");
  const [dateFilter,   setDateFilter]   = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS[0]);
  const [selectedIds,  setSelectedIds]  = useState(new Set());
  const [selectAll,    setSelectAll]    = useState(false);
  const [page,         setPage]         = useState(1);
  const [detailOrder,  setDetailOrder]  = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = orders;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== STATUS_OPTIONS[0]) {
      list = list.filter((o) => o.status === statusFilter);
    }
    return list;
  }, [orders, search, statusFilter]);

  const handleSelectAll = useCallback(() => {
    setSelectAll((prev) => {
      const next = !prev;
      setSelectedIds(next ? new Set(filtered.map((o) => o.id)) : new Set());
      return next;
    });
  }, [filtered]);

  const handleSelectRow = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectAll(next.size === filtered.length && filtered.length > 0);
      return next;
    });
  }, [filtered]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    setSelectedIds(new Set());
    setSelectAll(false);
  }, []);

  const applyStatusUpdate = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setDetailOrder((d) => (d?.id === orderId ? { ...d, status: newStatus } : d));
  }, []);

  const handleMenuAction = useCallback((action, order) => {
    switch (action) {
      case "view":
        setDetailOrder(order);
        break;
      case "status":
        setStatusTarget(order);
        break;
      case "print":
        break;
      case "cancel":
        applyStatusUpdate(order.id, "Cancelled");
        break;
    }
  }, [applyStatusUpdate]);

  const handleStatusConfirm = useCallback((orderId, newStatus) => {
    applyStatusUpdate(orderId, newStatus);
    setStatusTarget(null);
  }, [applyStatusUpdate]);

  return (
    <div className="space-y-4">
      <OrdersToolbar
        search={search}
        onSearch={setSearch}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        onExport={() => {}}
      />

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <OrdersTable
          orders={filtered}
          selectedIds={selectedIds}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onMenuAction={handleMenuAction}
        />
        <OrdersPagination
          total={TOTAL_ORDERS}
          page={page}
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
