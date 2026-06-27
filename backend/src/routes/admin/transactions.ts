import { FastifyPluginAsync } from "fastify";
import { Transaction } from "../../models/Transaction";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";

export const adminTransactionRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/transactions
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 20);

    const filter: any = {};
    if (q.status && q.status !== "all") filter.status = q.status;
    if (q.method && q.method !== "all") filter.method = q.method;
    if (q.search) filter.$or = [
      { transactionId: { $regex: q.search, $options: "i" } },
      { orderRef:      { $regex: q.search, $options: "i" } },
    ];
    if (q.from || q.to) {
      filter.createdAt = {};
      if (q.from) filter.createdAt.$gte = new Date(q.from);
      if (q.to)   filter.createdAt.$lte = new Date(q.to + "T23:59:59.999Z");
    }

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email avatar")
        .populate("orderId", "orderId status items subtotal discount couponCode total")
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    // Aggregate totals for the filtered set
    const [agg] = await Transaction.aggregate([
      { $match: filter },
      { $group: {
        _id: null,
        totalAmount:  { $sum: "$amount" },
        successCount: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
        pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        refundCount:  { $sum: { $cond: [{ $eq: ["$status", "refunded"]}, 1, 0] } },
        failedCount:  { $sum: { $cond: [{ $eq: ["$status", "failed"]  }, 1, 0] } },
      }},
    ]);

    reply.send({
      transactions,
      summary: agg ?? { totalAmount: 0, successCount: 0, pendingCount: 0, refundCount: 0, failedCount: 0 },
      ...paginationMeta(page, limit, totalCount),
    });
  });

  // GET /admin/transactions/:id
  app.get("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const txn = await Transaction.findById((req.params as any).id)
      .populate("userId", "name email avatar")
      .populate("orderId", "orderId status items total shippingAddress paymentMethod")
      .lean();
    if (!txn) return reply.status(404).send({ message: "Transaction not found" });
    reply.send({ transaction: txn });
  });

  // PATCH /admin/transactions/:id/status  — mark refunded / failed (manual override)
  app.patch("/:id/status", { preHandler: adminOnly }, async (req, reply) => {
    const { status } = req.body as any;
    const allowed = ["success", "pending", "failed", "refunded"];
    if (!allowed.includes(status)) {
      return reply.status(400).send({ message: "Invalid status" });
    }
    const txn = await Transaction.findByIdAndUpdate(
      (req.params as any).id,
      { status },
      { new: true }
    );
    if (!txn) return reply.status(404).send({ message: "Transaction not found" });
    reply.send({ transaction: txn });
  });
};
