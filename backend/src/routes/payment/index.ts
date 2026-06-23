import { FastifyPluginAsync } from "fastify";
import { authenticate } from "../../hooks/authenticate";
import { razorpay } from "../../lib/razorpay";
import { env } from "../../config/env";

export const paymentRoutes: FastifyPluginAsync = async (app) => {

  // POST /payment/create-order
  // Called by the frontend before opening the Razorpay modal.
  // Creates a Razorpay order server-side and returns the order ID + key.
  app.post("/create-order", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["amount"],
        properties: {
          amount: { type: "number", minimum: 1 },
        },
      },
    },
  }, async (req, reply) => {
    if (!env.razorpayKeyId || !env.razorpayKeySecret) {
      return reply.status(503).send({ message: "Payment gateway not configured. Contact support." });
    }

    const { amount } = req.body as { amount: number };

    const order = await (razorpay.orders.create as Function)({
      amount:   Math.round(amount * 100), // Razorpay expects paise (1 INR = 100 paise)
      currency: "INR",
      receipt:  `rcpt_${Date.now().toString(36)}`,
    });

    reply.send({
      razorpayOrderId: order.id,
      amount:          order.amount,  // in paise — frontend passes this directly to the modal
      currency:        order.currency,
      keyId:           env.razorpayKeyId,
    });
  });
};
