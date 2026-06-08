"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconChevronRight, IconCheck, IconSparkle } from "@/lib/icons";

import GeneralInfoCard    from "./Components/GeneralInfoCard";
import MediaUploadCard    from "./Components/MediaUploadCard";
import PricingCard        from "./Components/PricingCard";
import DescriptionCard    from "./Components/DescriptionCard";
import SpecificationsCard from "./Components/SpecificationsCard";
import VariantsCard       from "./Components/VariantsCard";
import SeoCard            from "./Components/SeoCard";
import StatusSideCard     from "./Components/StatusSideCard";
import TagsSideCard       from "./Components/TagsSideCard";
import ProductPreviewCard from "./Components/ProductPreviewCard";
import { CATEGORIES, BRANDS } from "../data";

function generateSKU() {
  const n = Math.floor(10000 + Math.random() * 90000);
  const s = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `APT-${n}-${s}`;
}

const EMPTY_FORM = {
  name: "", stock: "0",
  category: CATEGORIES[1] ?? CATEGORIES[0],
  brand: BRANDS[1] ?? BRANDS[0],
  images: ["", "", "", "", ""],
  basePrice: "", salePrice: "",
  description: "",
  weight: "", dimensions: "", lifeStage: "All Stages", animalTypes: [],
  status: "active", isPublic: true,
  tags: ["Organic", "Premium"],
  metaTitle: "", metaDescription: "", urlSlug: "",
  variants: [],
};

function productToForm(p) {
  const name = p.name ?? "";
  return {
    name,
    sku:       p.sku  ?? generateSKU(),
    stock:     String(p.stock    ?? 0),
    category:  p.category ?? (CATEGORIES[1] ?? CATEGORIES[0]),
    brand:     p.brand    ?? (BRANDS[1]     ?? BRANDS[0]),
    images:    [p.image ?? "", "", "", "", ""],
    basePrice: String(p.priceRaw ?? ""),
    salePrice: "",
    description: "",
    weight: "", dimensions: "",
    lifeStage: "All Stages", animalTypes: [],
    status: "active", isPublic: true,
    tags: ["Organic", "Premium"],
    metaTitle:       name,
    metaDescription: "",
    urlSlug: name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
    variants: [],
  };
}

/** @param {{ product?: any }} props */
export default function CreateProductContainer({ product = undefined }) {
  const router  = useRouter();
  const isEdit  = Boolean(product?.id);

  const [form, setForm] = useState(() =>
    product ? productToForm(product) : { ...EMPTY_FORM, sku: generateSKU() }
  );
  const [done, setDone] = useState(false);

  const setField = useCallback((key, val) => {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "name" && !isEdit) {
        next.urlSlug = val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        if (!f.metaTitle) next.metaTitle = val;
      }
      return next;
    });
  }, [isEdit]);

  const refreshSKU = useCallback(() => setField("sku", generateSKU()), [setField]);

  const addTag = useCallback((tag) => {
    setForm((f) => ({
      ...f,
      tags: !tag.trim() || f.tags.includes(tag.trim()) ? f.tags : [...f.tags, tag.trim()],
    }));
  }, []);

  const removeTag = useCallback((tag) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }, []);

  const toggleAnimalType = useCallback((type) => {
    setForm((f) => ({
      ...f,
      animalTypes: f.animalTypes.includes(type)
        ? f.animalTypes.filter((t) => t !== type)
        : [...f.animalTypes, type],
    }));
  }, []);

  const addVariant    = useCallback(() => {
    setForm((f) => ({ ...f, variants: [...f.variants, { name: "", price: "", stock: "" }] }));
  }, []);

  const updateVariant = useCallback((idx, key, val) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === idx ? { ...v, [key]: val } : v)),
    }));
  }, []);

  const removeVariant = useCallback((idx) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  }, []);

  const handleSubmit = useCallback(() => {
    setDone(true);
    setTimeout(() => router.push("/admin/products"), 1200);
  }, [router]);

  return (
    <div className="space-y-5 pb-12">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1 text-[10px] text-on-surface-variant mb-1.5">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <IconChevronRight size={11} />
            <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
            {isEdit && (
              <>
                <IconChevronRight size={11} />
                <span className="text-on-surface-variant truncate max-w-[120px]">{product.name}</span>
              </>
            )}
            <IconChevronRight size={11} />
            <span className="text-primary font-semibold">{isEdit ? "Edit" : "Add New"}</span>
          </nav>
          <h1 className="text-sm font-bold text-on-surface">
            {isEdit ? "Edit Product" : "Create New Product"}
          </h1>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            {isEdit
              ? `Editing — ${product.name}`
              : "Fill in the details below to add a product to your inventory."}
          </p>
        </div>

        <div className="flex gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-5 py-2 rounded-full border border-primary text-primary text-xs font-semibold hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
          >
            {isEdit ? "Discard Changes" : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={done}
            className="px-6 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer disabled:opacity-80 flex items-center gap-1.5"
          >
            {done
              ? <><IconCheck size={13} weight="bold" /> {isEdit ? "Saved!" : "Published!"}</>
              : isEdit ? "Save Changes" : "Publish Product"
            }
          </button>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Main (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">
          <GeneralInfoCard
            name={form.name} sku={form.sku} stock={form.stock}
            category={form.category} brand={form.brand}
            onField={setField} onRefreshSKU={refreshSKU}
            skuReadOnly={isEdit}
          />
          <MediaUploadCard images={form.images} onField={setField} />
          <PricingCard basePrice={form.basePrice} salePrice={form.salePrice} onField={setField} />
          <DescriptionCard description={form.description} onField={setField} />
          <SpecificationsCard
            weight={form.weight} dimensions={form.dimensions}
            lifeStage={form.lifeStage} animalTypes={form.animalTypes}
            onField={setField} onToggleAnimalType={toggleAnimalType}
          />
          <VariantsCard
            variants={form.variants}
            onAdd={addVariant} onUpdate={updateVariant} onRemove={removeVariant}
          />
          <SeoCard
            urlSlug={form.urlSlug} metaTitle={form.metaTitle}
            metaDescription={form.metaDescription} onField={setField}
          />
        </div>

        {/* ── Sidebar (1/3) ── */}
        <div className="space-y-5">
          <StatusSideCard status={form.status} isPublic={form.isPublic} onField={setField} />
          <TagsSideCard tags={form.tags} onAdd={addTag} onRemove={removeTag} />
          <ProductPreviewCard
            name={form.name} basePrice={form.basePrice} salePrice={form.salePrice}
            image={form.images[0]} category={form.category} status={form.status}
          />
          <div className="p-4 bg-tertiary-fixed rounded-xl border border-tertiary/20 flex gap-3">
            <IconSparkle size={16} className="text-tertiary flex-shrink-0 mt-0.5" weight="duotone" />
            <div>
              <p className="text-xs font-bold text-on-surface">Pro Tip</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                {isEdit
                  ? "Update the main image and description to refresh how this product appears in search results."
                  : "Products with 4+ images and a detailed description see up to 35% higher conversion rates."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
