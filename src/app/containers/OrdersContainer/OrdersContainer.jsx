"use client";

import useOrdersContainer from "./OrdersContainer.hook";
import OrdersHeader from "./Components/OrdersHeader";
import OrderCard    from "./Components/OrderCard";
import Pagination   from "@/components/common/Pagination";

export default function OrdersContainer() {
  const {
    filteredOrders,
    searchQuery,
    setSearchQuery,
    expandedOrders,
    toggleExpand,
  } = useOrdersContainer();

  return (
    <div className="py-2">
      <OrdersHeader searchQuery={searchQuery} onSearch={setSearchQuery} />

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrders.has(order.id)}
              onToggleExpand={() => toggleExpand(order.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <span className="material-symbols-outlined text-outline" style={{ fontSize: 40 }}>
            receipt_long
          </span>
          <p className="text-xs text-on-surface-variant">No orders match your search.</p>
        </div>
      )}

      <Pagination
        variant="load-more"
        hasMore={true}
        label="Load Past Orders"
      />
    </div>
  );
}
