import { FastifyPluginAsync } from "fastify";
import { Notification } from "../../models/Notification";
import { authenticate } from "../../hooks/authenticate";
import { parsePagination, paginationMeta } from "../../utils/paginate";

export const notificationRoutes: FastifyPluginAsync = async (app) => {

  // GET /notifications
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 20);

    const filter: any = { userId: req.user.userId };
    if (q.filter && q.filter !== "all") filter.type = q.filter;

    const [notifications, totalCount, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.user.userId, read: false }),
    ]);

    reply.send({ notifications, unreadCount, ...paginationMeta(page, limit, totalCount) });
  });

  // PUT /notifications/:id/read
  app.put("/:id/read", { preHandler: authenticate }, async (req, reply) => {
    await Notification.findOneAndUpdate(
      { _id: (req.params as any).id, userId: req.user.userId },
      { read: true }
    );
    reply.send({ success: true });
  });

  // PUT /notifications/read-all
  app.put("/read-all", { preHandler: authenticate }, async (req, reply) => {
    await Notification.updateMany({ userId: req.user.userId, read: false }, { read: true });
    reply.send({ success: true });
  });

  // DELETE /notifications/:id
  app.delete("/:id", { preHandler: authenticate }, async (req, reply) => {
    await Notification.findOneAndDelete({ _id: (req.params as any).id, userId: req.user.userId });
    reply.send({ success: true });
  });
};
