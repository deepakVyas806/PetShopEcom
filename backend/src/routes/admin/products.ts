import { FastifyPluginAsync } from "fastify";
import { Product } from "../../models/Product";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { invalidate, invalidatePattern, cacheKey } from "../../utils/cache";

export const adminProductRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/products
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = {};
    if (q.category)            filter.category = q.category;
    if (q.brand)               filter.brand = q.brand;
    if (q.status)              filter.status = q.status;
    if (q.search)              filter.$text = { $search: q.search };

    const [products, totalCount, categories, brands] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.distinct("brand"),
    ]);

    reply.send({ products, categories, brands, ...paginationMeta(page, limit, totalCount) });
  });

  // POST /admin/products
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const body = req.body as any;
    const product = await Product.create(body);
    await invalidatePattern(app, "products:*");
    reply.status(201).send({ product });
  });

  // PUT /admin/products/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const product = await Product.findByIdAndUpdate(
      (req.params as any).id,
      req.body as any,
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
