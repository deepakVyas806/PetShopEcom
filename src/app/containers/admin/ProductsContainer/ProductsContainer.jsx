"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconPackage, IconWarning } from "@/lib/icons";
import { SkStatCard, SkTable } from "@/components/ui";
import { api, qs } from "@/lib/api";
import { fmt } from "@/lib/currency";
import ProductsToolbar    from "./Components/ProductsToolbar";
import ProductsTable      from "./Components/ProductsTable";
import ProductsPagination from "./Components/ProductsPagination";
import BulkActionBar      from "./Components/BulkActionBar";
import DeleteConfirmModal from "./Components/DeleteConfirmModal";


function toUiProduct(p) {
  return {
    id:       p._id,
    name:     p.name,
    variant:  p.variant ?? "",
    sku:      p.sku,
    category: p.category,
    brand:    p.brand,
    price:    fmt(p.price ?? 0),
    priceRaw: p.price ?? 0,
    stock:    p.stock ?? 0,
    maxStock: p.maxStock ?? 100,
    status:   p.status ?? "In Stock",
    image:    p.image ?? "",
  };
}

export default function ProductsContainer() {
  const router = useRouter();

  const [products,     setProducts]     = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [catalogCats,  setCatalogCats]  = useState([]);
  const [catalogBrands,setCatalogBrands]= useState([]);

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");  // "" = all
  const [brand,    setBrand]    = useState("");  // "" = all
  const [selectedIds,  setSelectedIds] = useState(new Set());
  const [selectAll,    setSelectAll]   = useState(false);
  const [page,         setPage]        = useState(1);
  const [perPage,      setPerPage]     = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/products${qs({
        page, limit: perPage,
        ...(search   ? { search }   : {}),
        ...(category ? { category } : {}),
        ...(brand    ? { brand }    : {}),
      })}`);
      setProducts((data.products ?? []).map(toUiProduct));
      setTotal(data.total ?? 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, category, brand]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Fetch catalog for toolbar filter dropdowns (labels from catalog, values = slugs)
  useEffect(() => {
    Promise.all([
      api.get("/catalog?type=category"),
      api.get("/catalog?type=brand"),
    ]).then(([cats, brs]) => {
      const toOpts = items => (items ?? []).map(i => ({ value: i.slug, label: i.name }));
      setCatalogCats(toOpts(cats.items));
      setCatalogBrands(toOpts(brs.items));
    }).catch(() => {});
  }, []);

  const lowStockCount = products.filter(p => p.status === "Low Stock").length;

  const handleSelectAll = useCallback(() => {
    setSelectAll(prev => {
      const next = !prev;
      setSelectedIds(next ? new Set(products.map(p => p.id)) : new Set());
      return next;
    });
  }, [products]);

  const handleSelectRow = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectAll(next.size === products.length && products.length > 0);
      return next;
    });
  }, [products]);

  const handlePageChange = useCallback((p) => {
    setPage(p); setSelectedIds(new Set()); setSelectAll(false);
  }, []);

  const handlePerPageChange = useCallback((n) => {
    setPerPage(n); setPage(1); setSelectedIds(new Set()); setSelectAll(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try { await api.delete(`/admin/products/${deleteTarget.id}`); } catch {}
    setDeleteTarget(null);
    fetchProducts();
  }, [deleteTarget, fetchProducts]);

  const handleBulkDelete = useCallback(async () => {
    await Promise.allSettled([...selectedIds].map(id => api.delete(`/admin/products/${id}`)));
    setSelectedIds(new Set()); setSelectAll(false);
    fetchProducts();
  }, [selectedIds, fetchProducts]);

  const isInitial = loading && products.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {isInitial ? (
          <>
            <div className="w-32 h-12 rounded-xl bg-on-surface/8 animate-pulse" />
            <div className="w-32 h-12 rounded-xl bg-on-surface/8 animate-pulse" />
          </>
        ) : (
          <>
            <div className="px-4 py-2.5 bg-surface-container-high rounded-xl border border-outline-variant/30 flex items-center gap-2.5 shadow-sm">
              <IconPackage size={18} className="text-primary" weight="duotone" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-outline">Total Items</p>
                <p className="text-xs font-bold">{total.toLocaleString()}</p>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-error/5 border border-error/20 rounded-xl flex items-center gap-2.5 shadow-sm">
              <IconWarning size={18} className="text-error" weight="duotone" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-error">Low Stock</p>
                <p className="text-xs font-bold text-error">{lowStockCount} Alerts</p>
              </div>
            </div>
          </>
        )}
      </div>

      <ProductsToolbar
        search={search}     onSearch={v => { setSearch(v); setPage(1); }}
        category={category} onCategory={v => { setCategory(v); setPage(1); }}
        brand={brand}       onBrand={v => { setBrand(v); setPage(1); }}
        categories={catalogCats}
        brands={catalogBrands}
        onExport={() => {}}
        onAdd={() => router.push("/admin/products/create")}
      />

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {isInitial ? (
          <div className="overflow-x-auto">
            <SkTable rows={10} cols={5} hasCheckbox hasAvatar />
          </div>
        ) : (
          <ProductsTable
            products={products}
            selectedIds={selectedIds}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onEdit={(p) => router.push(`/admin/products/${p.id}/edit`)}
            onDelete={(p) => setDeleteTarget(p)}
          />
        )}
        <ProductsPagination
          total={total}
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
