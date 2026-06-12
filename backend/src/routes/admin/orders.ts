import { FastifyPluginAsync } from "fastify";
import { Order } from "../../models/Order";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";

const VALID_STATUSES = ["Pending","Confirmed","Processing","Shipped","Out for Delivery","Delivered","Cancelled","Refunded"];

export const adminOrderRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/orders
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = {};
    if (q.status && q.status !== "All Statuses") filter.status = q.status;
    if (q.search) filter.$or = [
      { orderId: { $regex: q.search, $options: "i" } },
    ];

    const [orders, totalCount] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        .populate("userId", "name email avatar").lean(),
      Order.countDocuments(filter),
    ]);

    reply.send({ orders, statusOptions: VALID_STATUSES, ...paginationMeta(page, limit, totalCount) });
  });

  // GET /admin/orders/:id
  app.get("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const order = await Order.findById((req.params as any).id)
      .populate("userId", "name email avatar").lean();
    if (!order) return reply.status(404).send({ message: "Order not found" });
    reply.send({ order });
  });

  // PUT /admin/orders/:id/status
  app.put("/:id/status", {
    preHandler: adminOnly,
    schema: {
      body: {
        type: "object",
        required: ["status"],
        properties: { status: { type: "string", enum: VALID_STATUSES } },
      },
    },
  }, async (req, reply) => {
    const { status } = req.body as any;
    const order = await Order.findByIdAndUpdate(
      (req.params as any).id,
      { status },
      { new: true }
    );
    if (!order) return reply.status(404).send({ message: "Order not found" });
    reply.send({ order });
  });
};
