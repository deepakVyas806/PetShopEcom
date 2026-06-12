import { FastifyPluginAsync } from "fastify";
import { User } from "../../models/User";
import { Order } from "../../models/Order";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";

export const adminCustomerRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/customers
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 8);

    const filter: any = { role: "customer" };
    if (q.search) {
      filter.$or = [
        { name:  { $regex: q.search, $options: "i" } },
        { email: { $regex: q.search, $options: "i" } },
      ];
    }

    const [customers, totalCount] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    reply.send({ customers, ...paginationMeta(page, limit, totalCount) });
  });

  // GET /admin/customers/:id
  app.get("/:id", { preHandler: adminOnly }, async (req, reply) => {
    const { id } = req.params as any;

    const [customer, orders] = await Promise.all([
      User.findById(id).lean(),
      Order.find({ userId: id }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    if (!customer) return reply.status(404).send({ message: "Customer not found" });

    const ltv = orders.reduce((s, o) => s + o.total, 0);
    reply.send({ customer, orders, ltv });
  });
};
