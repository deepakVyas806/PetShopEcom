import { FastifyPluginAsync } from "fastify";
import { Product } from "../../models/Product";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { invalidate, invalidatePattern, cacheKey } from "../../utils/cache";

/** Normalize frontend form field names to backend schema field names */
function normalizeProductBody(body: any) {
  const raw = body ?? {};

  // price/mrp — frontend sends basePrice (MRP) and optionally salePrice (discounted)
  const mrp   = Number(raw.mrp   ?? raw.basePrice ?? raw.price ?? 0);
  const price  = Number(raw.price ?? raw.salePrice ?? raw.basePrice ?? mrp);

  // images array — first non-empty entry becomes the main image
  const images: string[] = Array.isArray(raw.images)
    ? raw.images.filter((u: string) => u?.trim())
    : raw.image ? [raw.image] : [];

  // status — frontend uses "active"/"draft"; backend uses "In Stock"/"Out of Stock"
  let status = raw.status;
  if (status === "active")  status = "In Stock";
  if (status === "draft")   status = "Out of Stock";

  return {
    name:            raw.name,
    price,
    mrp:             mrp || price,
    category:        raw.category,
    brand:           raw.brand        ?? "",
    sku:             raw.sku,
    stock:           Number(raw.stock ?? 0),
    maxStock:        Number(raw.maxStock ?? raw.stock ?? 100),
    status:          status ?? "In Stock",
    active:          raw.active       ?? (raw.status !== "draft"),
    visibility:      raw.isPublic === false ? "private" : (raw.visibility ?? "public"),
    description:     raw.description  ?? "",
    bullets:         Array.isArray(raw.bullets) ? raw.bullets : [],
    badge:           raw.badge        ?? "",
    image:           images[0]        ?? raw.image ?? "",
    images,
    petTypes:        raw.petTypes     ?? raw.animalTypes ?? [],
    lifeStage:       raw.lifeStage    ?? "All Stages",
    weight:          raw.weight       ?? "",
    dimensions:      raw.dimensions   ?? "",
    variants:        Array.isArray(raw.variants)
      ? raw.variants.map((v: any) => ({
          name:  v.name  ?? "",
          price: Number(v.price ?? 0),
          stock: Number(v.stock ?? 0),
        }))
      : [],
    urlSlug:         raw.urlSlug         ?? "",
    metaTitle:       raw.metaTitle       ?? "",
    metaDescription: raw.metaDescription ?? "",
    featured:        raw.featured        ?? false,
    tags:            Array.isArray(raw.tags) ? raw.tags : [],
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
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.distinct("brand"),
    ]);

    reply.send({ products, categories, brands, ...paginationMeta(page, limit, totalCount) });
  });

  // GET /admin/products/:id
  app.get("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const product = await Product.findById((req.params as any).id).lean();
    if (!product) return reply.status(404).send({ message: "Product not found" });
    reply.send({ product });
  });

  // POST /admin/products
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const product = await Product.create(normalizeProductBody(req.body));
    await invalidatePattern(app, "products:*");
    reply.status(201).send({ product });
  });

  // PUT /admin/products/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const data    = normalizeProductBody(req.body);
    const product = await Product.findByIdAndUpdate(
      (req.params as any).id,
      data,
      { new: true, runValidators: true }
    );
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
