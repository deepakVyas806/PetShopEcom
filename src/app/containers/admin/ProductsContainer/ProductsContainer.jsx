"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconPackage, IconWarning } from "@/lib/icons";
import ProductsToolbar    from "./Components/ProductsToolbar";
import ProductsTable      from "./Components/ProductsTable";
import ProductsPagination from "./Components/ProductsPagination";
import BulkActionBar      from "./Components/BulkActionBar";
import DeleteConfirmModal from "./Components/DeleteConfirmModal";
import { PRODUCTS, CATEGORIES, BRANDS, TOTAL_INVENTORY, LOW_STOCK_ALERTS } from "./data";

export default function ProductsContainer() {
  const router = useRouter();

  const [products,    setProducts]    = useState(PRODUCTS);
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState(CATEGORIES[0]);
  const [brand,       setBrand]       = useState(BRANDS[0]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll,   setSelectAll]   = useState(false);
  const [page,        setPage]        = useState(1);
  const [perPage,     setPerPage]     = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)  ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (category !== CATEGORIES[0]) list = list.filter((p) => p.category === category);
    if (brand    !== BRANDS[0])     list = list.filter((p) => p.brand    === brand);
    return list;
  }, [products, search, category, brand]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const lowStockCount = useMemo(
    () => products.filter((p) => p.status === "Low Stock").length,
    [products]
  );

  const handleSelectAll = useCallback(() => {
    setSelectAll((prev) => {
      const next = !prev;
      setSelectedIds(next ? new Set(paginated.map((p) => p.id)) : new Set());
      return next;
    });
  }, [paginated]);

  const handleSelectRow = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectAll(next.size === paginated.length && paginated.length > 0);
      return next;
    });
  }, [paginated]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    setSelectedIds(new Set());
    setSelectAll(false);
  }, []);

  const handlePerPageChange = useCallback((n) => {
    setPerPage(n);
    setPage(1);
    setSelectedIds(new Set());
    setSelectAll(false);
  }, []);

  const handleDelete = useCallback(() => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget.id);
      return next;
    });
    setDeleteTarget(null);
  }, [deleteTarget]);

  const handleBulkDelete = useCallback(() => {
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setSelectAll(false);
  }, [selectedIds]);

  return (
    <div className="space-y-4">
      {/* Stat chips */}
      <div className="flex flex-wrap gap-3">
        <div className="px-4 py-2.5 bg-surface-container-high rounded-xl border border-outline-variant/30 flex items-center gap-2.5 shadow-sm">
          <IconPackage size={18} className="text-primary" weight="duotone" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline">Total Items</p>
            <p className="text-xs font-bold">{TOTAL_INVENTORY.toLocaleString()}</p>
          </div>
        </div>
        <div className="px-4 py-2.5 bg-error/5 border border-error/20 rounded-xl flex items-center gap-2.5 shadow-sm">
          <IconWarning size={18} className="text-error" weight="duotone" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-error">Low Stock</p>
            <p className="text-xs font-bold text-error">{lowStockCount || LOW_STOCK_ALERTS} Alerts</p>
          </div>
        </div>
      </div>

      <ProductsToolbar
        search={search}     onSearch={setSearch}
        category={category} onCategory={setCategory}
        brand={brand}       onBrand={setBrand}
        onExport={() => {}}
        onAdd={() => router.push("/admin/products/create")}
      />

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <ProductsTable
          products={paginated}
          selectedIds={selectedIds}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onEdit={(p) => router.push(`/admin/products/${p.id}/edit`)}
          onDelete={(p) => setDeleteTarget(p)}
        />
        <ProductsPagination
          total={filtered.length}
          page={page}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>

      <BulkActionBar
        count={selectedIds.size}
        onBulkDelete={handleBulkDelete}
        onBulkCategory={() => {}}
        onClose={() => { setSelectedIds(new Set()); setSelectAll(false); }}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
