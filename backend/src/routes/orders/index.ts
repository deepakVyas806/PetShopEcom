import { FastifyPluginAsync } from "fastify";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product";
import { Coupon } from "../../models/Coupon";
import { authenticate } from "../../hooks/authenticate";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { generateOrderId } from "../../utils/id";
import { env } from "../../config/env";

export const orderRoutes: FastifyPluginAsync = async (app) => {

  // GET /orders — user's order history
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = { userId: req.user.userId };
    if (q.status && q.status !== "all") filter.status = q.status;
    if (q.search) filter.orderId = { $regex: q.search, $options: "i" };

    const [orders, totalCount] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    reply.send({ orders, ...paginationMeta(page, limit, totalCount) });
  });

  // GET /orders/:id
  app.get("/:id", { preHandler: authenticate }, async (req, reply) => {
    const { id } = req.params as any;
    const order = await Order.findOne({ _id: id, userId: req.user.userId }).lean();
    if (!order) return reply.status(404).send({ message: "Order not found" });
    reply.send({ order });
  });

  // POST /orders — place an order
  app.post("/", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["items", "shippingAddress", "paymentMethod"],
        properties: {
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "string" },
                quantity:  { type: "number", minimum: 1 },
              },
            },
          },
          shippingAddress: { type: "object" },
          paymentMethod:   { type: "string" },
          couponCode:      { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body as any;

    // Fetch live product data (never trust client prices)
    const productIds = items.map((i: any) => i.productId);
    const products   = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

    const orderItems = items.map((item: any) => {
      const p = productMap[item.productId];
      if (!p) throw new Error(`Product ${item.productId} not found`);
      return {
        productId: p._id,
        name:      p.name,
        image:     p.image,
        price:     p.price,
        quantity:  item.quantity,
        sku:       p.sku,
      };
    });

    let subtotal = orderItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

    // Coupon validation
    let discount   = 0;
    let validCoupon: string | undefined;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: "active" });
      if (coupon && subtotal >= coupon.minOrder) {
        if (coupon.discountType === "percent")  discount = subtotal * (coupon.value / 100);
        if (coupon.discountType === "fixed")    discount = Math.min(coupon.value, subtotal);
        validCoupon = coupon.code;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usageCount: 1, revenue: subtotal - discount } });
      }
    }

    const tax      = (subtotal - discount) * env.taxRate;
    const shipping = subtotal >= env.freeShippingThreshold ? 0 : env.shippingFee;
    const total    = subtotal - discount + tax + shipping;

    const order = await Order.create({
      orderId: generateOrderId(),
      userId:  req.user.userId,
      items:   orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      couponCode: validCoupon,
      status: "Confirmed",
    });

    reply.status(201).send({ order });
  });
};
