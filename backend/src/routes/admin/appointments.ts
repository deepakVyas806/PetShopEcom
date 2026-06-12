import { FastifyPluginAsync } from "fastify";
import { Appointment } from "../../models/Appointment";
import { adminOnly } from "../../hooks/adminOnly";
import { parsePagination, paginationMeta } from "../../utils/paginate";

const VALID_STATUSES = ["Pending","Confirmed","Completed","Cancelled"];

export const adminAppointmentRoutes: FastifyPluginAsync = async (app) => {

  // GET /admin/appointments
  app.get("/", { preHandler: adminOnly }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = {};
    if (q.status) filter.status = q.status;
    if (q.date)   filter.date = q.date;
    if (q.month && q.year) {
      const m = String(parseInt(q.month)).padStart(2, "0");
      filter.date = { $regex: `^${q.year}-${m}` };
    }

    const [appointments, totalCount] = await Promise.all([
      Appointment.find(filter).sort({ date: -1, timeSlot: 1 }).skip(skip).limit(limit)
        .populate("userId", "name email avatar").lean(),
      Appointment.countDocuments(filter),
    ]);

    const now = new Date().toISOString().slice(0, 10);
    const [todayCount, pendingCount] = await Promise.all([
      Appointment.countDocuments({ date: now }),
      Appointment.countDocuments({ status: "Pending" }),
    ]);

    reply.send({ appointments, stats: { todayCount, pendingCount }, ...paginationMeta(page, limit, totalCount) });
  });

  // PUT /admin/appointments/:id/status
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
    const appt = await Appointment.findByIdAndUpdate(
      (req.params as any).id,
      { status: (req.body as any).status },
      { new: true }
    );
    if (!appt) return reply.status(404).send({ message: "Appointment not found" });
    reply.send({ appointment: appt });
  });
};
