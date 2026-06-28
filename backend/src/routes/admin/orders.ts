import { FastifyPluginAsync } from "fastify";
import { Order } from "../../models/Order";
import { Notification } from "../../models/Notification";
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

    const STATUS_ICON: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
      Shipped:          { icon: "local_shipping", iconBg: "bg-blue-100 dark:bg-blue-900/30",   iconColor: "text-blue-600 dark:text-blue-400"   },
      "Out for Delivery":{ icon: "local_shipping", iconBg: "bg-orange-100 dark:bg-orange-900/30",iconColor: "text-orange-600 dark:text-orange-400"},
      Delivered:        { icon: "check_circle",   iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400" },
      Cancelled:        { icon: "warning",        iconBg: "bg-red-100 dark:bg-red-900/30",     iconColor: "text-red-600 dark:text-red-400"     },
      Refunded:         { icon: "info",           iconBg: "bg-purple-100 dark:bg-purple-900/30",iconColor:"text-purple-600 dark:text-purple-400"},
    };
    const meta = STATUS_ICON[status];
    if (meta) {
      Notification.create({
        userId:    order.userId,
        type:      "order",
        icon:      meta.icon,
        iconBg:    meta.iconBg,
        iconColor: meta.iconColor,
        title:     `Order ${order.orderId} — ${status}`,
        body:      `Your order status has been updated to "${status}".`,
        actions:   [
          { label: "Track Order",  variant: "primary",   href: `/track-order/${order._id}` },
          { label: "View Details", variant: "secondary", href: `/order-detail/${order._id}` },
        ],
      }).catch(() => {});
    }

    reply.send({ order });
  });
};
