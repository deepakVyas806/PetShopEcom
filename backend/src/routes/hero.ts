import { FastifyPluginAsync } from "fastify";
import { HeroSlide } from "../models/HeroSlide";

export const heroRoutes: FastifyPluginAsync = async (app) => {
  // GET /hero  →  returns active hero slides sorted by order
  app.get("/", async (req, reply) => {
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1 }).lean();
    reply.send({ slides });
  });
};
