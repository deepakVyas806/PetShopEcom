import { FastifyPluginAsync } from "fastify";
import { Coupon } from "../../models/Coupon";
import { authenticate } from "../../hooks/authenticate";

export const couponRoutes: FastifyPluginAsync = async (app) => {

  // GET /coupons — list currently active coupons (public)
  app.get("/", async (_req, reply) => {
    const now = new Date();
    const coupons = await Coupon.find({
      status:    "active",
      startDate: { $lte: now },
      endDate:   { $gte: now },
      $or: [
        { usageLimit: 0 },
        { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
      ],
    })
      .select("code description discountType value minOrder endDate")
      .sort({ value: -1 })
      .lean();
    reply.send({ coupons });
  });

  // POST /coupons/validate — validate a coupon code against an order total
  app.post("/validate", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["code", "orderTotal"],
        properties: {
          code:       { type: "string" },
          orderTotal: { type: "number", minimum: 0 },
        },
      },
    },
  }, async (req, reply) => {
    const { code, orderTotal } = req.body as any;
    const now = new Date();

    const coupon = await Coupon.findOne({
      code:   code.toUpperCase(),
      status: "active",
      startDate: { $lte: now },
      endDate:   { $gte: now },
    }).lean();

    if (!coupon) {
      return reply.send({ valid: false, message: "Invalid or expired coupon code." });
    }

    if (orderTotal < coupon.minOrder) {
      return reply.send({
        valid:   false,
        message: `Minimum order of ₹${coupon.minOrder} required for this coupon.`,
      });
    }

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return reply.send({ valid: false, message: "This coupon has reached its usage limit." });
    }

    let discount = 0;
    if (coupon.discountType === "percent") discount = orderTotal * (coupon.value / 100);
    if (coupon.discountType === "fixed")   discount = Math.min(coupon.value, orderTotal);

    reply.send({ valid: true, coupon, discount });
  });
};
