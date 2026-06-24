import { FastifyPluginAsync } from "fastify";
import { HeroSlide } from "../../models/HeroSlide";
import { adminOnly } from "../../hooks/adminOnly";

export const adminHeroRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/hero
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const slides = await HeroSlide.find().sort({ order: 1 }).lean();
    reply.send({ slides });
  });

  // POST /admin/hero
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const slide = await HeroSlide.create(req.body as any);
    reply.status(201).send({ slide });
  });

  // PUT /admin/hero/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const slide = await HeroSlide.findByIdAndUpdate(
      (req.params as any).id,
      req.body as any,
      { new: true, runValidators: true }
    ).lean();
    if (!slide) return reply.status(404).send({ message: "Slide not found" });
    reply.send({ slide });
  });

  // DELETE /admin/hero/:id
  app.delete("/:id", { preHandler: adminOnly }, async (req, reply) => {
    await HeroSlide.findByIdAndDelete((req.params as any).id);
    reply.send({ success: true });
  });

  // PATCH /admin/hero/:id/toggle  — flip active
  app.patch("/:id/toggle", { preHandler: adminOnly }, async (req, reply) => {
    const doc = await HeroSlide.findById((req.params as any).id);
    if (!doc) return reply.status(404).send({ message: "Slide not found" });
    doc.active = !doc.active;
    await doc.save();
    reply.send({ slide: doc.toObject() });
  });

  // PATCH /admin/hero/reorder  — [{id, order}, ...]
  app.patch("/reorder", { preHandler: adminOnly }, async (req, reply) => {
    const updates = req.body as { id: string; order: number }[];
    if (!Array.isArray(updates)) return reply.status(400).send({ message: "Expected array" });
    await Promise.all(updates.map(({ id, order }) =>
      HeroSlide.findByIdAndUpdate(id, { order })
    ));
    reply.send({ success: true });
  });
};
