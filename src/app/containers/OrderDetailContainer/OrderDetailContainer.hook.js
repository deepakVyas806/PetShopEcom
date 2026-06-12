import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export const ORDER_STEPS = [
  { id: "confirmed",    label: "Confirmed",         icon: "check"          },
  { id: "processing",   label: "Processing",        icon: "inventory"      },
  { id: "shipped",      label: "Shipped",           icon: "local_shipping" },
  { id: "out_delivery", label: "Out for Delivery",  icon: "hail"           },
  { id: "delivered",    label: "Delivered",         icon: "home_pin"       },
];

const STATUS_STEP = {
  "Order Confirmed": 0,
  "Processing":      1,
  "Shipped":         2,
  "Out for Delivery":3,
  "Delivered":       4,
};

export default function useOrderDetailContainer(orderId) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!orderId) return;
    api.get(`/orders/${orderId}`)
      .then(data => setOrder({ ...data.order, activeStep: STATUS_STEP[data.order?.status] ?? 0 }))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  return { order, loading, error, ORDER_STEPS };
}
