import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const STATUS_MILESTONES = (status) => {
  const steps = [
    { id: "placed",           label: "Order Placed",      icon: "check",          iconFill: true  },
    { id: "processing",       label: "Processing",        icon: "check",          iconFill: true  },
    { id: "packed",           label: "Packed",            icon: "check",          iconFill: true  },
    { id: "shipped",          label: "Shipped",           icon: "local_shipping", iconFill: false },
    { id: "out_for_delivery", label: "Out for Delivery",  icon: "near_me",        iconFill: false },
    { id: "delivered",        label: "Delivered",         icon: "inventory_2",    iconFill: false },
  ];
  const activeMap = { "Processing": 1, "Shipped": 3, "Out for Delivery": 4, "Delivered": 5 };
  const activeIdx = activeMap[status] ?? 0;
  return steps.map((s, i) => ({
    ...s,
    status: i < activeIdx ? "done" : i === activeIdx ? "active" : "pending",
  }));
};

export default function useTrackOrderContainer(orderId) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!orderId) return;
    api.get(`/orders/${orderId}`)
      .then(data => {
        const o = data.order;
        setOrder({ ...o, milestones: STATUS_MILESTONES(o?.status) });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  return { order, loading, error };
}
