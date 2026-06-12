import { FastifyPluginAsync } from "fastify";
import { Appointment } from "../../models/Appointment";
import { Service } from "../../models/Service";
import { authenticate } from "../../hooks/authenticate";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { generateBookingId } from "../../utils/id";

export const appointmentRoutes: FastifyPluginAsync = async (app) => {

  // GET /appointments
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 20);

    const filter: any = { userId: req.user.userId };
    if (q.status) filter.status = q.status;

    const now = new Date().toISOString().slice(0, 10);
    const [upcoming, past] = await Promise.all([
      Appointment.find({ ...filter, date: { $gte: now }, status: { $in: ["Pending","Confirmed"] } })
        .sort({ date: 1, timeSlot: 1 }).lean(),
      Appointment.find({ ...filter, $or: [{ date: { $lt: now } }, { status: { $in: ["Completed","Cancelled"] } }] })
        .sort({ date: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const totalPast = await Appointment.countDocuments({
      ...filter,
      $or: [{ date: { $lt: now } }, { status: { $in: ["Completed","Cancelled"] } }],
    });

    reply.send({ upcoming, past, ...paginationMeta(page, limit, totalPast) });
  });

  // GET /appointments/:id
  app.get("/:id", { preHandler: authenticate }, async (req, reply) => {
    const appt = await Appointment.findOne({ _id: (req.params as any).id, userId: req.user.userId }).lean();
    if (!appt) return reply.status(404).send({ message: "Appointment not found" });
    reply.send({ appointment: appt });
  });

  // POST /appointments — book
  app.post("/", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["serviceId", "date", "timeSlot", "petName"],
        properties: {
          serviceId: { type: "string" },
          date:      { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          timeSlot:  { type: "string" },
          petName:   { type: "string" },
          petType:   { type: "string" },
          notes:     { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const { serviceId, date, timeSlot, petName, petType, notes } = req.body as any;

    // Check slot availability
    const conflict = await Appointment.findOne({
      serviceId, date, timeSlot, status: { $in: ["Pending", "Confirmed"] },
    });
    if (conflict) {
      return reply.status(409).send({ message: "This time slot is already booked. Please choose another." });
    }

    const service = await Service.findById(serviceId).lean();
    if (!service) return reply.status(404).send({ message: "Service not found" });

    const appt = await Appointment.create({
      appointmentId: generateBookingId(),
      userId:        req.user.userId,
      serviceId,
      serviceName:   service.name,
      serviceIcon:   service.image,
      date,
      timeSlot,
      petName,
      petType,
      amount:        service.price,
      status:        "Confirmed",
      notes,
    });

    reply.status(201).send({ appointment: appt });
  });

  // PUT /appointments/:id/cancel
  app.put("/:id/cancel", { preHandler: authenticate }, async (req, reply) => {
    const appt = await Appointment.findOneAndUpdate(
      { _id: (req.params as any).id, userId: req.user.userId, status: { $in: ["Pending","Confirmed"] } },
      { status: "Cancelled" },
      { new: true }
    );
    if (!appt) return reply.status(404).send({ message: "Appointment not found or already completed" });
    reply.send({ appointment: appt });
  });
};
