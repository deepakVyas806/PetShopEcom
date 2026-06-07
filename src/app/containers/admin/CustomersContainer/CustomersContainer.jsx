"use client";
import { useState, useMemo, useCallback } from "react";
import { IconFilter, IconDownload } from "@/lib/icons";
import StatCards      from "./Components/StatCards";
import CustomersTable from "./Components/CustomersTable";
import InsightPanels  from "./Components/InsightPanels";
import { CUSTOMERS }  from "./data";

const PER_PAGE = 8;

export default function CustomersContainer() {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CUSTOMERS;
    return CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  const stats = useMemo(() => {
    const totalLtv = CUSTOMERS.reduce((s, c) => s + c.ltvRaw, 0);
    const totalOrders = CUSTOMERS.reduce((s, c) => s + c.orders, 0);
    return {
      totalParents: CUSTOMERS.length,
      avgOrders:    (totalOrders / (CUSTOMERS.length || 1)).toFixed(1),
      totalLtv,
      activeSubs:   CUSTOMERS.filter((c) => c.status === "vip").length,
    };
  }, []);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p) => setPage(p), []);

  return (
    <div className="space-y-6">
      {/* Action row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search customers by name, email or ID…"
          className="flex-1 min-w-[220px] bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low border border-outline-variant text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
          >
            <IconFilter size={13} weight="bold" /> Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low border border-outline-variant text-on-surface-variant rounded-xl text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
          >
            <IconDownload size={13} weight="bold" /> Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <StatCards stats={stats} />

      {/* Table */}
      <CustomersTable
        customers={paginated}
        total={filtered.length}
        page={page}
        perPage={PER_PAGE}
        onPageChange={handlePageChange}
      />

      {/* Insight panels */}
      <InsightPanels customers={CUSTOMERS} />
    </div>
  );
}
