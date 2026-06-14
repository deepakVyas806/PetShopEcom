import { FastifyPluginAsync } from "fastify";
import { Service } from "../../models/Service";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { invalidate, invalidatePattern, cacheKey } from "../../utils/cache";

/** Normalize frontend form field names to backend schema field names */
function normalizeServiceBody(body: any) {
  const raw = body ?? {};

  const images: string[] = Array.isArray(raw.images)
    ? raw.images.filter((u: string) => u?.trim())
    : raw.image ? [raw.image] : [];

  return {
    name:           raw.name,
    title:          raw.title        || raw.name || "",
    category:       raw.category     ?? "",
    price:          Number(raw.price ?? raw.priceRaw ?? 0),
    duration:       raw.duration     ?? "60 min",
    capacity:       Number(raw.capacity ?? 10),
    description:    raw.description  ?? "",
    badge:          raw.badge        ?? "",
    image:          images[0]        ?? raw.image ?? "",
    images,
    petTypes:       Array.isArray(raw.petTypes)  ? raw.petTypes  : [],
    targetPets:     raw.targetPets   ?? "",
    availability:   raw.availability ?? "instant",
    includes:       raw.includes     ?? "",
    specialist:     raw.specialist   ?? "",
    active:         raw.active       ?? true,
    visibility:     raw.visibility   ?? "public",
    featured:       raw.featured     ?? false,
    tags:           Array.isArray(raw.tags) ? raw.tags : [],
    operatingHours: Array.isArray(raw.operatingHours)
      ? raw.operatingHours.map((h: any) => ({
          day:   h.day   ?? "",
          start: h.start ?? "09:00",
          end:   h.end   ?? "17:00",
        }))
      : [],
  };
}

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

  // GET /admin/services/:id
  app.get("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const service = await Service.findById((req.params as any).id).lean();
    if (!service) return reply.status(404).send({ message: "Service not found" });
    reply.send({ service });
  });

  // POST /admin/services
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const service = await Service.create(normalizeServiceBody(req.body));
    await invalidatePattern(app, "services:*");
    reply.status(201).send({ service });
  });

  // PUT /admin/services/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const data    = normalizeServiceBody(req.body);
    const service = await Service.findByIdAndUpdate(
      (req.params as any).id,
      data,
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
