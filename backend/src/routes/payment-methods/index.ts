import { FastifyPluginAsync } from "fastify";
import { PaymentMethod } from "../../models/PaymentMethod";
import { authenticate } from "../../hooks/authenticate";

export const paymentMethodRoutes: FastifyPluginAsync = async (app) => {

  // GET /payment-methods
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const methods = await PaymentMethod.find({ userId: req.user.userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
    const cards   = methods.filter(m => m.type === "card");
    const paypal  = methods.find(m => m.type === "paypal");
    const wallet  = methods.find(m => m.type === "wallet");
    reply.send({ cards, paypal: paypal ?? null, wallet: wallet ?? null });
  });

  // POST /payment-methods/cards
  app.post("/cards", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["network", "last4", "holder", "expiry"],
        properties: {
          label:     { type: "string" },
          network:   { type: "string" },
          last4:     { type: "string", minLength: 4, maxLength: 4 },
          holder:    { type: "string" },
          expiry:    { type: "string" },
          isDefault: { type: "boolean" },
        },
      },
    },
  }, async (req, reply) => {
    const body = req.body as any;
    if (body.isDefault) {
      await PaymentMethod.updateMany({ userId: req.user.userId }, { isDefault: false });
    }
    const card = await PaymentMethod.create({ ...body, type: "card", userId: req.user.userId });
    reply.status(201).send({ card });
  });

  // PUT /payment-methods/cards/:id/set-default
  app.put("/cards/:id/set-default", { preHandler: authenticate }, async (req, reply) => {
    await PaymentMethod.updateMany({ userId: req.user.userId }, { isDefault: false });
    await PaymentMethod.findOneAndUpdate(
      { _id: (req.params as any).id, userId: req.user.userId },
      { isDefault: true }
    );
    const cards = await PaymentMethod.find({ userId: req.user.userId, type: "card" }).sort({ isDefault: -1 }).lean();
    reply.send({ cards });
  });

  // DELETE /payment-methods/cards/:id
  app.delete("/cards/:id", { preHandler: authenticate }, async (req, reply) => {
    await PaymentMethod.findOneAndDelete({ _id: (req.params as any).id, userId: req.user.userId });
    reply.send({ success: true });
  });

  // POST /payment-methods/paypal/connect
  app.post("/paypal/connect", { preHandler: authenticate }, async (_req, reply) => {
    // In production: redirect to PayPal OAuth. For now, return a mock redirect.
    reply.send({ redirectUrl: "https://www.paypal.com/connect?scope=email&mock=true" });
  });
};
