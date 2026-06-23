"use client";

import { useState, useMemo } from "react";
import useOrdersContainer from "./OrdersContainer.hook";
import { IconReceipt } from "@/lib/icons";
import OrdersHeader from "./Components/OrdersHeader";
import OrderCard    from "./Components/OrderCard";
import Pagination   from "@/components/common/Pagination";

const STATUS_TABS = [
  { label: "All",       filter: null                                           },
  { label: "Active",    filter: (s) => ["Order Confirmed", "Shipped", "Out for Delivery"].includes(s) },
  { label: "Delivered", filter: (s) => s === "Delivered"                       },
  { label: "Cancelled", filter: (s) => s === "Cancelled"                       },
];

export default function OrdersContainer() {
  const {
    filteredOrders,
    searchQuery,
    setSearchQuery,
    expandedOrders,
    toggleExpand,
  } = useOrdersContainer();

  const [activeTab, setActiveTab] = useState(0);

  const tabOrders = useMemo(() => {
    const fn = STATUS_TABS[activeTab].filter;
    return fn ? filteredOrders.filter((o) => fn(o.status)) : filteredOrders;
  }, [filteredOrders, activeTab]);

  return (
    <div className="py-2">
      <OrdersHeader searchQuery={searchQuery} onSearch={setSearchQuery} />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map((tab, i) => {
          const count = tab.filter
            ? filteredOrders.filter((o) => tab.filter(o.status)).length
            : filteredOrders.length;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer outline-none shrink-0 ${
                activeTab === i
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-on-surface-variant border-outline-variant/40 hover:border-primary/30"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ${
                  activeTab === i ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tabOrders.length > 0 ? (
        <div className="space-y-4">
          {tabOrders.map((order) => (
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
          <IconReceipt size={40} className="text-outline" weight="duotone" />
          <p className="text-xs text-on-surface-variant">
            {activeTab === 0 ? "No orders match your search." : `No ${STATUS_TABS[activeTab].label.toLowerCase()} orders.`}
          </p>
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
