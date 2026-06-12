import { FastifyPluginAsync } from "fastify";
import { Service } from "../../models/Service";
import { cached, cacheKey } from "../../utils/cache";
import { parsePagination, paginationMeta } from "../../utils/paginate";

export const serviceRoutes: FastifyPluginAsync = async (app) => {

  // GET /services
  app.get("/", async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 20);
    const key = cacheKey("services", JSON.stringify(q));

    const data = await cached(app, key, async () => {
      const filter: any = { active: true, visibility: "public" };
      if (q.category && q.category !== "all") filter.category = q.category;
      if (q.petTypes)  filter.petTypes = { $in: (q.petTypes as string).split(",") };
      if (q.maxPrice)  filter.price = { $lte: parseFloat(q.maxPrice) };
      if (q.search)    filter.$text = { $search: q.search };

      const [services, totalCount] = await Promise.all([
        Service.find(filter).sort({ featured: -1, rating: -1 }).skip(skip).limit(limit).lean(),
        Service.countDocuments(filter),
      ]);

      const categories = await Service.distinct("category", { active: true });

      return { services, categories, ...paginationMeta(page, limit, totalCount) };
    }, 300);

    reply.send(data);
  });

  // GET /services/:id
  app.get("/:id", async (req, reply) => {
    const { id } = req.params as any;
    const key = cacheKey("service", id);

    const service = await cached(app, key, () => Service.findById(id).lean(), 600);
    if (!service) return reply.status(404).send({ message: "Service not found" });

    reply.send({ service });
  });

  // GET /services/:id/availability — available time slots for a date
  app.get("/:id/availability", async (req, reply) => {
    const { id } = req.params as any;
    const { date } = req.query as any;

    if (!date) return reply.status(400).send({ message: "date query param required (YYYY-MM-DD)" });

    const { Appointment } = await import("../../models/Appointment");
    const booked = await Appointment.find({
      serviceId: id,
      date,
      status: { $in: ["Pending", "Confirmed"] },
    }).distinct("timeSlot");

    const ALL_SLOTS = [
      "09:00 AM","09:30 AM","10:00 AM","11:00 AM",
      "01:00 PM","02:30 PM","03:00 PM","04:30 PM",
      "06:00 PM","07:00 PM",
    ];

    reply.send({
      availableSlots:   ALL_SLOTS.filter(s => !booked.includes(s)),
      unavailableSlots: booked,
    });
  });
};
