import { FastifyPluginAsync } from "fastify";
import { adminOnly } from "../../hooks/adminOnly";
import { StoreSettings, getOrCreateSettings } from "../../models/StoreSettings";

export const adminSettingsRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/settings
  app.get("/", { preHandler: adminOnly }, async (_req, reply) => {
    const settings = await getOrCreateSettings();
    reply.send({ settings });
  });

  // PATCH /admin/settings
  app.patch("/", { preHandler: adminOnly }, async (req, reply) => {
    const existing = await getOrCreateSettings();
    const doc = await StoreSettings.findByIdAndUpdate(
      (existing as any)._id,
      req.body as any,
      { new: true, runValidators: true, upsert: true }
    ).lean();
    reply.send({ settings: doc });
  });
};
