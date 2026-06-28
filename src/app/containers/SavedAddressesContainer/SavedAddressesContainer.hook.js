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
    try { await api.put(`/addresses/${id}/set-default`); } catch { /* optimistic */ }
  };

  const deleteAddress = async (id) => {
    setAddresses(prev => prev.filter(a => (a._id ?? a.id) !== id));
    try { await api.delete(`/addresses/${id}`); } catch { /* optimistic */ }
  };

  const addAddress = async (data) => {
    const res = await api.post("/addresses", data);
    const saved = res.address;
    setAddresses(prev => {
      const list = data.isDefault
        ? prev.map(a => ({ ...a, isDefault: false }))
        : prev;
      return [saved, ...list];
    });
    return saved;
  };

  const updateAddress = async (id, data) => {
    const res = await api.put(`/addresses/${id}`, data);
    const saved = res.address;
    setAddresses(prev => {
      const list = data.isDefault
        ? prev.map(a => ({ ...a, isDefault: false }))
        : prev;
      return list.map(a => ((a._id ?? a.id) === id ? saved : a));
    });
    return saved;
  };

  return { addresses, loading, setAsDefault, deleteAddress, addAddress, updateAddress };
}
