import { FastifyPluginAsync } from "fastify";
import { Coupon } from "../../models/Coupon";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";

export const adminPromotionRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/promotions
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = {};
    if (q.status) filter.status = q.status;
    if (q.search) filter.$or = [
      { name: { $regex: q.search, $options: "i" } },
      { code: { $regex: q.search, $options: "i" } },
    ];

    const [coupons, totalCount] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(filter),
    ]);

    const stats = await Coupon.aggregate([
      { $group: {
        _id: null,
        totalRevenue: { $sum: "$revenue" },
        totalActive:  { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
      }},
    ]);

    reply.send({
      coupons,
      stats: { totalRevenue: stats[0]?.totalRevenue ?? 0, totalActive: stats[0]?.totalActive ?? 0 },
      ...paginationMeta(page, limit, totalCount),
    });
  });

  // POST /admin/promotions
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const coupon = await Coupon.create(req.body as any);
    reply.status(201).send({ coupon });
  });

  // PUT /admin/promotions/:id
  app.put("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const coupon = await Coupon.findByIdAndUpdate(
      (req.params as any).id,
      req.body as any,
      { new: true, runValidators: true }
    );
    if (!coupon) return reply.status(404).send({ message: "Coupon not found" });
    reply.send({ coupon });
  });

  // DELETE /admin/promotions/:id
  app.delete("/:id", { preHandler: adminOnly }, async (req, reply) => {
    await Coupon.findByIdAndDelete((req.params as any).id);
    reply.send({ success: true });
  });
};
