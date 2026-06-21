import { FastifyPluginAsync } from "fastify";
import { getOrCreateSettings } from "../models/StoreSettings";

// Public read-only settings — used by cart and checkout to get tax rate, shipping threshold, etc.
export const settingsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (_req, reply) => {
    const settings = await getOrCreateSettings();
    reply.send({ settings });
  });
};
