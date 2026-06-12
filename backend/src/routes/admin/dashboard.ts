import { FastifyPluginAsync } from "fastify";
import { Order } from "../../models/Order";
import { User } from "../../models/User";
import { Appointment } from "../../models/Appointment";
import { Product } from "../../models/Product";
import { adminOnly } from "../../hooks/adminOnly";
import { cached } from "../../utils/cache";

export const adminDashboardRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/dashboard
  app.get("/", { preHandler: adminOnly }, async (_req, reply) => {
    const data = await cached(app, "admin:dashboard", async () => {
      const now       = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalOrders, totalCustomers, totalRevenue,
        todayRevenue, monthRevenue,
        pendingOrders, recentOrders,
        topProducts,
      ] = await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
        Order.aggregate([
          { $match: { createdAt: { $gte: todayStart } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.aggregate([
          { $match: { createdAt: { $gte: monthStart } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.countDocuments({ status: "Pending" }),
        Order.find().sort({ createdAt: -1 }).limit(5).lean(),
        Order.aggregate([
          { $unwind: "$items" },
          { $group: { _id: "$items.productId", name: { $first: "$items.name" }, image: { $first: "$items.image" }, totalSold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
        ]),
      ]);

      return {
        stats: {
          totalOrders,
          totalCustomers,
          totalRevenue:  totalRevenue[0]?.total  ?? 0,
          todayRevenue:  todayRevenue[0]?.total  ?? 0,
          monthRevenue:  monthRevenue[0]?.total  ?? 0,
          pendingOrders,
        },
        recentOrders,
        topProducts,
      };
    }, 60); // 1 minute TTL for dashboard

    reply.send(data);
  });
};
