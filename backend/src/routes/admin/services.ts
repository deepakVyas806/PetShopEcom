import { FastifyPluginAsync } from "fastify";
import { Service } from "../../models/Service";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { invalidate, invalidatePattern, cacheKey } from "../../utils/cache";

export const adminServiceRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/services
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = {};
    if (q.category) filter.category = q.category;
    if (q.search)   filter.$text = { $search: q.search };

    const [services, totalCount, categories] = await Promise.all([
      Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Service.countDocuments(filter),
      Service.distinct("category"),
    ]);

    reply.send({ services, categories, ...paginationMeta(page, limit, totalCount) });
  });

  // POST /admin/services
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const service = await Service.create(req.body as any);
    await invalidatePattern(app, "services:*");
    reply.status(201).send({ service });
  });

  // PUT /admin/services/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const service = await Service.findByIdAndUpdate(
      (req.params as any).id,
      req.body as any,
      { new: true, runValidators: true }
    );
    if (!service) return reply.status(404).send({ message: "Service not found" });
    await Promise.all([
      invalidate(app, cacheKey("service", (req.params as any).id)),
      invalidatePattern(app, "services:*"),
    ]);
    reply.send({ service });
  });

  // DELETE /admin/services/:id
  app.delete("/:id", { preHandler: adminOnly }, async (req, reply) => {
    await Service.findByIdAndDelete((req.params as any).id);
    await Promise.all([
      invalidate(app, cacheKey("service", (req.params as any).id)),
      invalidatePattern(app, "services:*"),
    ]);
    reply.send({ success: true });
  });
};
