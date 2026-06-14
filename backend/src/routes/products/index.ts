import { FastifyPluginAsync } from "fastify";
import { Product } from "../../models/Product";
import { Review } from "../../models/Review";
import { authenticate } from "../../hooks/authenticate";
import { cached, invalidatePattern, cacheKey } from "../../utils/cache";
import { parsePagination, paginationMeta } from "../../utils/paginate";

export const productRoutes: FastifyPluginAsync = async (app) => {

  // GET /products — list with filters, sort, pagination
  app.get("/", async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 20);

    const key = cacheKey("products", JSON.stringify({ ...q }));

    const data = await cached(app, key, async () => {
      const filter: any = { active: true };
      if (q.category)   filter.category = q.category;
      if (q.brand)      filter.brand = q.brand;
      if (q.petTypes)   filter.petTypes = { $in: (q.petTypes as string).split(",").map((t: string) => new RegExp(`^${t}$`, "i")) };
      if (q.maxPrice)   filter.price = { $lte: parseFloat(q.maxPrice) };
      if (q.minRating)  filter.rating = { $gte: parseFloat(q.minRating) };
      if (q.search)     filter.$text = { $search: q.search };
      if (q.featured)   filter.featured = true;

      const sortMap: Record<string, any> = {
        "Price: Low to High": { price: 1 },
        "Price: High to Low": { price: -1 },
        "Rating":             { rating: -1 },
        "Newest Arrivals":    { createdAt: -1 },
        "Popularity":         { reviewsCount: -1 },
      };
      const sort = sortMap[q.sortBy as string] ?? { reviewsCount: -1 };

      const [products, totalCount] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
      ]);

      return { products, ...paginationMeta(page, limit, totalCount) };
    }, 300);

    reply.send(data);
  });

  // GET /products/:id
  app.get("/:id", async (req, reply) => {
    const { id } = req.params as any;
    const key = cacheKey("product", id);

    const product = await cached(app, key, () =>
      Product.findById(id).lean(), 600
    );

    if (!product) return reply.status(404).send({ message: "Product not found" });

    // Fetch rating summary alongside
    const ratingAgg = await Review.aggregate([
      { $match: { productId: product._id } },
      { $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
        dist: { $push: "$rating" },
      }},
    ]);

    reply.send({ product, ratingAgg: ratingAgg[0] ?? null });
  });
};
