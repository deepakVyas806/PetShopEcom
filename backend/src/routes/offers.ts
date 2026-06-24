import { FastifyPluginAsync } from "fastify";
import { Offer } from "../models/Offer";

export const offerRoutes: FastifyPluginAsync = async (app) => {
  // GET /offers?landingPage=true  →  returns active offers (filtered to landing page ones if landingPage=true)
  app.get("/", async (req, reply) => {
    const { landingPage } = req.query as { landingPage?: string };
    const filter: Record<string, unknown> = { active: true };
    if (landingPage === "true") filter.showOnLandingPage = true;
    const offers = await Offer.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    reply.send({ offers });
  });
};
