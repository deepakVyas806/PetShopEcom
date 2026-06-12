import { FastifyPluginAsync } from "fastify";
import { Address } from "../../models/Address";
import { authenticate } from "../../hooks/authenticate";

export const addressRoutes: FastifyPluginAsync = async (app) => {

  // GET /addresses
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const addresses = await Address.find({ userId: req.user.userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
    reply.send({ addresses });
  });

  // POST /addresses
  app.post("/", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["name", "line1", "city", "state", "pincode", "phone"],
        properties: {
          name:      { type: "string" },
          type:      { type: "string" },
          label:     { type: "string" },
          line1:     { type: "string" },
          line2:     { type: "string" },
          city:      { type: "string" },
          state:     { type: "string" },
          country:   { type: "string" },
          pincode:   { type: "string" },
          phone:     { type: "string" },
          isDefault: { type: "boolean" },
        },
      },
    },
  }, async (req, reply) => {
    const body = req.body as any;
    if (body.isDefault) {
      await Address.updateMany({ userId: req.user.userId }, { isDefault: false });
    }
    const address = await Address.create({ ...body, userId: req.user.userId });
    reply.status(201).send({ address });
  });

  // PUT /addresses/:id
  app.put("/:id", { preHandler: authenticate }, async (req, reply) => {
    const body = req.body as any;
    if (body.isDefault) {
      await Address.updateMany({ userId: req.user.userId }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: (req.params as any).id, userId: req.user.userId },
      body, { new: true, runValidators: true }
    );
    if (!address) return reply.status(404).send({ message: "Address not found" });
    reply.send({ address });
  });

  // PUT /addresses/:id/set-default
  app.put("/:id/set-default", { preHandler: authenticate }, async (req, reply) => {
    await Address.updateMany({ userId: req.user.userId }, { isDefault: false });
    await Address.findOneAndUpdate({ _id: (req.params as any).id, userId: req.user.userId }, { isDefault: true });
    const addresses = await Address.find({ userId: req.user.userId }).sort({ isDefault: -1 }).lean();
    reply.send({ addresses });
  });

  // DELETE /addresses/:id
  app.delete("/:id", { preHandler: authenticate }, async (req, reply) => {
    await Address.findOneAndDelete({ _id: (req.params as any).id, userId: req.user.userId });
    reply.send({ success: true });
  });
};
