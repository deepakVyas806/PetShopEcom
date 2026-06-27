import { FastifyPluginAsync } from "fastify";
import mongoose               from "mongoose";
import { Coupon }             from "../../models/Coupon";
import { Product }            from "../../models/Product";
import { authenticate }       from "../../hooks/authenticate";

function activeFilter(now: Date) {
  return {
    status:    "active",
    startDate: { $lte: now },
    endDate:   { $gte: now },
    $or: [
      { usageLimit: 0 },
      { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
    ],
  };
}

function calcDiscount(discountType: string, value: number, amount: number): number {
  if (discountType === "percent") return amount * (value / 100);
  if (discountType === "fixed")   return Math.min(value, amount);
  return 0;
}

export const couponRoutes: FastifyPluginAsync = async (app) => {

  // GET /coupons — all globally-scoped active coupons (public listing)
  app.get("/", async (_req, reply) => {
    const now = new Date();
    const coupons = await Coupon.find({ ...activeFilter(now), scope: "global" })
      .select("code name description discountType value minOrder endDate scope")
      .sort({ value: -1 })
      .lean();
    reply.send({ coupons });
  });

  // GET /coupons/applicable — coupons visible for a given context
  // Query params: productIds (comma-separated), serviceId
  // Backend resolves categoryIds from the provided productIds — frontend only needs to send product IDs
  app.get("/applicable", async (req, reply) => {
    const now = new Date();
    const q   = req.query as any;

    const parseIds = (val?: string) =>
      (val ?? "").split(",").map(s => s.trim()).filter(s => mongoose.isValidObjectId(s)).map(s => new mongoose.Types.ObjectId(s));

    const productIds = parseIds(q.productIds ?? q.productId);
    const serviceIds = parseIds(q.serviceIds ?? q.serviceId);

    const scopeOr: any[] = [{ scope: "global" }];

    if (productIds.length) {
      // Match any coupon scoped to one of these products
      scopeOr.push({ scope: "product", productIds: { $in: productIds } });

      // Look up categoryIds from DB so the frontend doesn't need to track them
      const products    = await Product.find({ _id: { $in: productIds } }).select("categoryId").lean();
      const categoryIds = [...new Set(products.map(p => p.categoryId).filter(Boolean).map(id => id!.toString()))]
                            .map(s => new mongoose.Types.ObjectId(s));

      if (categoryIds.length) {
        scopeOr.push({ scope: "category", categoryIds: { $in: categoryIds } });
      }
    }

    if (serviceIds.length) {
      scopeOr.push({ scope: "service", serviceIds: { $in: serviceIds } });
    }

    const coupons = await Coupon.find({
      ...activeFilter(now),
      $or: scopeOr,
    })
      .select("code name description discountType value minOrder endDate scope")
      .sort({ scope: 1, value: -1 })
      .lean();

    reply.send({ coupons });
  });

  // POST /coupons/validate — check a code and calculate discount
  // Body: { code, orderTotal, items?: [{productId, categoryId, subtotal}], serviceId? }
  app.post("/validate", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["code", "orderTotal"],
        properties: {
          code:       { type: "string" },
          orderTotal: { type: "number", minimum: 0 },
          serviceId:  { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId:  { type: "string" },
                categoryId: { type: "string" },
                subtotal:   { type: "number" },
              },
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    const { code, orderTotal, items = [], serviceId } = req.body as any;
    const now = new Date();

    const coupon = await Coupon.findOne({
      code:      code.toUpperCase(),
      status:    "active",
      startDate: { $lte: now },
      endDate:   { $gte: now },
    }).lean();

    if (!coupon) {
      return reply.send({ valid: false, message: "Invalid or expired coupon code." });
    }
    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return reply.send({ valid: false, message: "This coupon has reached its usage limit." });
    }
    if (orderTotal < coupon.minOrder) {
      return reply.send({
        valid:   false,
        message: `Minimum order of ₹${coupon.minOrder} required for this coupon.`,
      });
    }

    // Calculate the discountable subtotal based on scope
    let discountableAmount = orderTotal;

    if (coupon.scope === "product" && coupon.productIds?.length && items.length) {
      const ids = coupon.productIds.map(id => id.toString());
      discountableAmount = items
        .filter((i: any) => ids.includes(i.productId))
        .reduce((s: number, i: any) => s + (i.subtotal ?? 0), 0);
    } else if (coupon.scope === "category" && coupon.categoryIds?.length && items.length) {
      const ids = coupon.categoryIds.map(id => id.toString());
      discountableAmount = items
        .filter((i: any) => ids.includes(i.categoryId))
        .reduce((s: number, i: any) => s + (i.subtotal ?? 0), 0);
    } else if (coupon.scope === "service" && coupon.serviceIds?.length) {
      const ids = coupon.serviceIds.map(id => id.toString());
      if (!serviceId || !ids.includes(serviceId)) {
        return reply.send({ valid: false, message: "This offer is not applicable to your selection." });
      }
      discountableAmount = orderTotal;
    }

    if (discountableAmount <= 0) {
      return reply.send({ valid: false, message: "This offer is not applicable to items in your cart." });
    }

    const discount = calcDiscount(coupon.discountType, coupon.value, discountableAmount);

    reply.send({
      valid:   true,
      coupon:  { code: coupon.code, name: coupon.name, scope: coupon.scope, discountType: coupon.discountType, value: coupon.value },
      discountableAmount,
      discount,
    });
  });
};
