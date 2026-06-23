import { FastifyPluginAsync } from "fastify";
import { CatalogItem, CATALOG_TYPES, toSlug } from "../../models/CatalogItem";
import { adminOnly } from "../../hooks/adminOnly";

export const adminCatalogRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/catalog?type=...
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const { type } = req.query as { type?: string };
    const filter: Record<string, unknown> = {};
    if (type && CATALOG_TYPES.includes(type as any)) filter.type = type;
    const items = await CatalogItem.find(filter).sort({ order: 1, name: 1 }).lean();
    reply.send({ items });
  });

  // POST /admin/catalog
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const body = req.body as any;
    const slug = body.slug?.trim() || toSlug(body.name ?? "");
    const item = await CatalogItem.create({ ...body, slug });
    reply.status(201).send({ item });
  });

  // PUT /admin/catalog/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const body = req.body as any;
    if (!body.slug && body.name) body.slug = toSlug(body.name);
    const item = await CatalogItem.findByIdAndUpdate(
      (req.params as any).id,
      body,
      { new: true, runValidators: true }
    ).lean();
    if (!item) return reply.status(404).send({ message: "Item not found" });
    reply.send({ item });
  });

  // DELETE /admin/catalog/:id
  app.delete("/:id", { preHandler: adminOnly }, async (req, reply) => {
    await CatalogItem.findByIdAndDelete((req.params as any).id);
    reply.send({ success: true });
  });

  // PATCH /admin/catalog/:id/toggle — flip active
  app.patch("/:id/toggle", { preHandler: adminOnly }, async (req, reply) => {
    const doc = await CatalogItem.findById((req.params as any).id);
    if (!doc) return reply.status(404).send({ message: "Item not found" });
    doc.active = !doc.active;
    await doc.save();
    reply.send({ item: doc.toObject() });
  });

  // PATCH /admin/catalog/reorder — [{id, order}, ...]
  app.patch("/reorder", { preHandler: adminOnly }, async (req, reply) => {
    const updates = req.body as { id: string; order: number }[];
    if (!Array.isArray(updates)) return reply.status(400).send({ message: "Expected array" });
    await Promise.all(updates.map(({ id, order }) =>
      CatalogItem.findByIdAndUpdate(id, { order })
    ));
    reply.send({ success: true });
  });
};
