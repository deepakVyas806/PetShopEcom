import { FastifyPluginAsync } from "fastify";
import { Order } from "../../models/Order";
import { User } from "../../models/User";
import { Appointment } from "../../models/Appointment";
import { Product } from "../../models/Product";
import { Service } from "../../models/Service";
import { Coupon }  from "../../models/Coupon";
import { adminOnly } from "../../hooks/adminOnly";
import { cached } from "../../utils/cache";

export const adminDashboardRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/dashboard
  app.get("/", { preHandler: adminOnly }, async (_req, reply) => {
    const data = await cached(app, "admin:dashboard", async () => {
      const now        = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const weekStart  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const yearStart  = new Date(now.getFullYear(), 0, 1);

      const [
        totalOrders, totalCustomers, totalRevenue,
        todayRevenue, monthRevenue, weekRevenue,
        pendingOrders, totalProducts, totalServices, totalCoupons,
        recentOrders, topProducts,
        monthlyRevenue, categoryRevenue,
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
        Order.aggregate([
          { $match: { createdAt: { $gte: weekStart } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.countDocuments({ status: "Pending" }),
        Product.countDocuments(),
        Service.countDocuments({ active: true }),
        Coupon.countDocuments({ status: "active" }),
        Order.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name email avatar").lean(),
        Order.aggregate([
          { $unwind: "$items" },
          { $group: { _id: "$items.productId", name: { $first: "$items.name" }, image: { $first: "$items.image" }, totalSold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
        ]),
        // Monthly revenue for current year — one entry per month
        Order.aggregate([
          { $match: { createdAt: { $gte: yearStart } } },
          { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$total" } } },
          { $sort: { _id: 1 } },
        ]),
        // Revenue by product category via lookup
        Order.aggregate([
          { $unwind: "$items" },
          { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "p" } },
          { $unwind: { path: "$p", preserveNullAndEmptyArrays: true } },
          { $group: {
            _id:     { $ifNull: ["$p.category", "Other"] },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          }},
          { $sort:  { revenue: -1 } },
          { $limit: 5 },
        ]),
      ]);

      // Build a full 12-slot array of monthly totals (index 0 = Jan, 11 = Dec)
      const monthTotals: number[] = Array(12).fill(0);
      for (const m of monthlyRevenue as { _id: number; total: number }[]) {
        monthTotals[m._id - 1] = m.total;
      }

      return {
        stats: {
          totalOrders,
          totalCustomers,
          totalRevenue:  totalRevenue[0]?.total  ?? 0,
          todayRevenue:  todayRevenue[0]?.total  ?? 0,
          monthRevenue:  monthRevenue[0]?.total  ?? 0,
          weekRevenue:   weekRevenue[0]?.total   ?? 0,
          pendingOrders,
          totalProducts,
          totalServices,
          totalCoupons,
        },
        recentOrders,
        topProducts,
        monthlyRevenue: monthTotals,
        categoryRevenue: (categoryRevenue as { _id: string; revenue: number }[]).map(c => ({
          label:   c._id,
          revenue: c.revenue,
        })),
      };
    }, 60);

    reply.send(data);
  });
};
