import { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";
import { Product } from "../../models/Product";
import { CatalogItem } from "../../models/CatalogItem";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { invalidate, invalidatePattern, cacheKey } from "../../utils/cache";

const POPULATE_CATALOG = "categoryId brandId petTypeIds lifeStageId";

function toObjectId(id: any): mongoose.Types.ObjectId | null {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

/**
 * Normalize frontend form fields → backend schema fields.
 * Accepts catalog ObjectIds (categoryId, brandId, petTypeIds, lifeStageId).
 * Derives slug-based string fields (category, brand, petTypes, lifeStage)
 * by looking up catalog items — these string fields keep the public filter API working.
 */
async function normalizeProductBody(body: any) {
  const raw = body ?? {};

  // Parse catalog ObjectIds from payload
  const categoryId  = toObjectId(raw.categoryId);
  const brandId     = toObjectId(raw.brandId);
  const lifeStageId = toObjectId(raw.lifeStageId);
  const petTypeIds  = Array.isArray(raw.petTypeIds)
    ? raw.petTypeIds.map(toObjectId).filter(Boolean) as mongoose.Types.ObjectId[]
    : [];

  // Resolve all catalog IDs in one query → build a slug/name lookup map
  const allIds = [categoryId, brandId, lifeStageId, ...petTypeIds].filter(Boolean);
  const catalogMap: Record<string, { name: string; slug: string }> = {};
  if (allIds.length) {
    const items = await CatalogItem.find({ _id: { $in: allIds } }).select("name slug").lean();
    items.forEach(item => {
      catalogMap[item._id.toString()] = { name: item.name, slug: item.slug };
    });
  }

  const getSlug = (id: mongoose.Types.ObjectId | null) =>
    id ? (catalogMap[id.toString()]?.slug ?? "") : "";

  // Derived string fields — slug-based for public filter API backward compat
  const category  = categoryId  ? getSlug(categoryId)  : (raw.category  ?? "");
  const brand     = brandId     ? getSlug(brandId)     : (raw.brand     ?? "");
  const lifeStage = lifeStageId ? getSlug(lifeStageId) : (raw.lifeStage ?? "");
  const petTypes  = petTypeIds.length
    ? petTypeIds.map(id => getSlug(id)).filter(Boolean)
    : (Array.isArray(raw.petTypes) ? raw.petTypes : raw.animalTypes ?? []);

  // price/mrp
  const mrp   = Number(raw.mrp ?? raw.basePrice ?? raw.price ?? 0);
  const price  = Number(raw.price ?? raw.salePrice ?? raw.basePrice ?? mrp);

  // images
  const images: string[] = Array.isArray(raw.images)
    ? raw.images.filter((u: string) => u?.trim())
    : raw.image ? [raw.image] : [];

  // frontend status → backend status
  let status = raw.status;
  if (status === "active") status = "In Stock";
  if (status === "draft")  status = "Out of Stock";

  return {
    name:        raw.name,
    price,
    mrp:         mrp || price,
    sku:         raw.sku,
    stock:       Number(raw.stock ?? 0),
    maxStock:    Number(raw.maxStock ?? raw.stock ?? 100),
    status:      status ?? "In Stock",
    active:      raw.active ?? (raw.status !== "draft"),
    visibility:  raw.isPublic === false ? "private" : (raw.visibility ?? "public"),
    description: raw.description ?? "",
    bullets:     Array.isArray(raw.bullets) ? raw.bullets : [],
    badge:       raw.badge ?? "",
    image:       images[0] ?? raw.image ?? "",
    images,
    weight:      raw.weight ?? "",
    dimensions:  raw.dimensions ?? "",
    variants:    Array.isArray(raw.variants)
      ? raw.variants.map((v: any) => ({
          name:  v.name  ?? "",
          price: Number(v.price ?? 0),
          stock: Number(v.stock ?? 0),
        }))
      : [],
    urlSlug:         raw.urlSlug ?? "",
    metaTitle:       raw.metaTitle ?? "",
    metaDescription: raw.metaDescription ?? "",
    featured:        raw.featured ?? false,
    // Tags stay as freeform strings; cascade delete on catalog tag handled separately
    tags:            Array.isArray(raw.tags) ? raw.tags : [],

    // FK ObjectId refs
    categoryId:  categoryId  ?? undefined,
    brandId:     brandId     ?? undefined,
    petTypeIds,
    lifeStageId: lifeStageId ?? undefined,

    // Derived string slugs for backward-compat filtering
    category,
    brand,
    petTypes,
    lifeStage,
  };
}

export const adminProductRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/products
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = {};
    if (q.category) filter.category = q.category;
    if (q.brand)    filter.brand    = q.brand;
    if (q.status)   filter.status   = q.status;
    if (q.search)   filter.$text    = { $search: q.search };

    const [products, totalCount, categories, brands] = await Promise.all([
      Product.find(filter)
        .populate(POPULATE_CATALOG)
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.distinct("brand"),
    ]);

    reply.send({ products, categories, brands, ...paginationMeta(page, limit, totalCount) });
  });

  // GET /admin/products/:id
  app.get("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const product = await Product.findById((req.params as any).id)
      .populate(POPULATE_CATALOG)
      .lean();
    if (!product) return reply.status(404).send({ message: "Product not found" });
    reply.send({ product });
  });

  // POST /admin/products
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const data    = await normalizeProductBody(req.body);
    const product = await Product.create(data);
    await invalidatePattern(app, "products:*");
    reply.status(201).send({ product });
  });

  // PUT /admin/products/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const data    = await normalizeProductBody(req.body);
    const product = await Product.findByIdAndUpdate(
      (req.params as any).id,
      data,
      { new: true, runValidators: true }
    ).populate(POPULATE_CATALOG).lean();
    if (!product) return reply.status(404).send({ message: "Product not found" });
    await Promise.all([
      invalidate(app, cacheKey("product", (req.params as any).id)),
      invalidatePattern(app, "products:*"),
    ]);
    reply.send({ product });
  });

  // DELETE /admin/products/:id
  app.delete("/:id", { preHandler: adminOnly }, async (req, reply) => {
    await Product.findByIdAndDelete((req.params as any).id);
    await Promise.all([
      invalidate(app, cacheKey("product", (req.params as any).id)),
      invalidatePattern(app, "products:*"),
    ]);
    reply.send({ success: true });
  });
};
