import { FastifyPluginAsync } from "fastify";
import { Offer } from "../../models/Offer";
import { adminOnly } from "../../hooks/adminOnly";

export const adminOfferRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/offers
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const offers = await Offer.find().sort({ order: 1, createdAt: 1 }).lean();
    reply.send({ offers });
  });

  // POST /admin/offers
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const offer = await Offer.create(req.body as any);
    reply.status(201).send({ offer });
  });

  // PUT /admin/offers/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const offer = await Offer.findByIdAndUpdate(
      (req.params as any).id,
      req.body as any,
      { new: true, runValidators: true }
    ).lean();
    if (!offer) return reply.status(404).send({ message: "Offer not found" });
    reply.send({ offer });
  });

  // DELETE /admin/offers/:id
  app.delete("/:id", { preHandler: adminOnly }, async (req, reply) => {
    await Offer.findByIdAndDelete((req.params as any).id);
    reply.send({ success: true });
  });

  // PATCH /admin/offers/:id/toggle  — flip active
  app.patch("/:id/toggle", { preHandler: adminOnly }, async (req, reply) => {
    const doc = await Offer.findById((req.params as any).id);
    if (!doc) return reply.status(404).send({ message: "Offer not found" });
    doc.active = !doc.active;
    await doc.save();
    reply.send({ offer: doc.toObject() });
  });

  // PATCH /admin/offers/:id/landing  — flip showOnLandingPage
  app.patch("/:id/landing", { preHandler: adminOnly }, async (req, reply) => {
    const doc = await Offer.findById((req.params as any).id);
    if (!doc) return reply.status(404).send({ message: "Offer not found" });
    doc.showOnLandingPage = !doc.showOnLandingPage;
    await doc.save();
    reply.send({ offer: doc.toObject() });
  });
};
