import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function useSavedAddressesContainer() {
  const [addresses, setAddresses] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get("/addresses")
      .then(data => setAddresses(data.addresses ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setAsDefault = async (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: (a._id ?? a.id) === id })));
    try { await api.put(`/addresses/${id}/default`); } catch { /* optimistic */ }
  };

  const deleteAddress = async (id) => {
    setAddresses(prev => prev.filter(a => (a._id ?? a.id) !== id));
    try { await api.delete(`/addresses/${id}`); } catch { /* optimistic */ }
  };

  return { addresses, loading, setAsDefault, deleteAddress };
}
