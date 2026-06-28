import { memo } from "react";
import { IconSearch, IconCalendar, IconFilter, IconChevronDown, IconDownload } from "@/lib/icons";
import { DATE_OPTIONS, STATUS_OPTIONS } from "../data";

export default memo(function OrdersToolbar({
  search, onSearch,
  dateFilter, onDateFilter,
  statusFilter, onStatusFilter,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Filter row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" weight="regular" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search Order ID or Customer…"
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm border-none text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>

        {/* Date filter */}
        <div className="flex items-center bg-surface-container-low px-3 py-2.5 rounded-xl shadow-sm gap-2">
          <IconCalendar size={15} className="text-on-surface-variant shrink-0" weight="regular" />
          <select
            value={dateFilter}
            onChange={(e) => onDateFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs w-full cursor-pointer text-on-surface outline-none"
          >
            {DATE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center bg-surface-container-low px-3 py-2.5 rounded-xl shadow-sm gap-2">
          <IconFilter size={15} className="text-on-surface-variant shrink-0" weight="regular" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs w-full cursor-pointer text-on-surface outline-none"
          >
            {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Bulk actions — hidden for now */}
        {/* <button className="flex items-center justify-between px-3 py-2.5 bg-surface border border-outline-variant rounded-xl text-on-surface-variant text-xs hover:bg-surface-container-high transition-all cursor-pointer">
          <span className="font-medium">Bulk Actions</span>
          <IconChevronDown size={15} weight="bold" />
        </button> */}
      </div>
    </div>
  );
});
