import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function useTrackOrderContainer(orderId) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!orderId) return;
    api.get(`/orders/${orderId}`)
      .then(data => setOrder(data.order ?? null))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  return { order, loading, error };
}
