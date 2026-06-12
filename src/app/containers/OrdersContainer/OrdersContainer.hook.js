import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, qs } from "@/lib/api";

export default function useOrdersContainer() {
  const { logout } = useAuth();

  const [searchQuery,    setSearchQuery]    = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [currentPage,    setCurrentPage]    = useState(1);

  const [orders,      setOrders]      = useState([]);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/orders${qs({ page: currentPage, limit: 10, status: statusFilter, search: searchQuery || undefined })}`);
      setOrders(data.orders ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const toggleExpand = (id) =>
    setExpandedOrders(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return {
    orders, totalPages, loading,
    searchQuery, setSearchQuery: (q) => { setSearchQuery(q); setCurrentPage(1); },
    expandedOrders, toggleExpand,
    statusFilter, setStatusFilter: (s) => { setStatusFilter(s); setCurrentPage(1); },
    currentPage, setCurrentPage,
    logout,
  };
}
