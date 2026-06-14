"use client";
import { useState, useCallback, useEffect } from "react";
import { IconFilter, IconDownload } from "@/lib/icons";
import { SkStatCard, SkTable } from "@/components/ui";
import { api, qs } from "@/lib/api";
import StatCards      from "./Components/StatCards";
import CustomersTable from "./Components/CustomersTable";
import InsightPanels  from "./Components/InsightPanels";

const PER_PAGE = 8;

const fmtJoined = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

function toUiCustomer(c) {
  return {
    id:        String(c._id),
    name:      c.name,
    email:     c.email,
    avatar:    c.avatar ?? null,
    joinedAgo: fmtJoined(c.createdAt),
    orders:    0,
    ltvRaw:    0,
    ltv:       "—",
    status:    "active",
    pets:      c.petPrefs ?? [],
  };
}

export default function CustomersContainer() {
  const [customers, setCustomers] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/customers${qs({ page, limit: PER_PAGE, search: search || undefined })}`);
      setCustomers((data.customers ?? []).map(toUiCustomer));
      setTotal(data.total ?? 0);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const stats = {
    totalParents: total,
    avgOrders:    "—",
    totalLtv:     0,
    activeSubs:   0,
  };

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const isInitial = loading && customers.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search customers by name, email or ID…"
          className="flex-1 min-w-[220px] bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button type="button" className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low border border-outline-variant text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container transition-all cursor-pointer">
            <IconFilter size={13} weight="bold" /> Filter
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low border border-outline-variant text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container transition-all cursor-pointer">
            <IconDownload size={13} weight="bold" /> Export
          </button>
        </div>
      </div>

      {isInitial ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkStatCard key={i} />)}
        </div>
      ) : (
        <StatCards stats={stats} />
      )}

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {isInitial ? (
          <div className="overflow-x-auto">
            <SkTable rows={8} cols={4} hasCheckbox hasAvatar />
          </div>
        ) : (
          <CustomersTable
            customers={customers}
            total={total}
            page={page}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </div>

      <InsightPanels customers={customers} />
    </div>
  );
}
