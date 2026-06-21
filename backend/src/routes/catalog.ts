import { FastifyPluginAsync } from "fastify";
import { CatalogItem, CATALOG_TYPES } from "../models/CatalogItem";

export const catalogRoutes: FastifyPluginAsync = async (app) => {
  // GET /catalog?type=category|brand|petType|lifeStage|tag|badge
  // Returns active items for a given type (or all types if no filter)
  app.get("/", async (req, reply) => {
    const { type } = req.query as { type?: string };
    const filter: Record<string, unknown> = { active: true };
    if (type && CATALOG_TYPES.includes(type as any)) filter.type = type;
    const items = await CatalogItem.find(filter).sort({ order: 1, name: 1 }).lean();
    reply.send({ items });
  });
};
