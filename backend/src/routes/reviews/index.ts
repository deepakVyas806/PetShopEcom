import { FastifyPluginAsync } from "fastify";
import { Review } from "../../models/Review";
import { Product } from "../../models/Product";
import { Service } from "../../models/Service";
import { authenticate } from "../../hooks/authenticate";
import { parsePagination, paginationMeta } from "../../utils/paginate";
import { invalidate, cacheKey } from "../../utils/cache";

export const reviewRoutes: FastifyPluginAsync = async (app) => {

  // GET /reviews/featured — top-rated reviews for homepage Testimonials section
  app.get("/reviews/featured", async (_req, reply) => {
    const [reviews, totalCount, agg] = await Promise.all([
      Review.find({ rating: { $gte: 4 } })
        .sort({ helpfulCount: -1, createdAt: -1 })
        .limit(4)
        .lean(),
      Review.countDocuments(),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
    ]);

    reply.send({
      reviews: reviews.map(r => ({
        _id:      r._id,
        userName: r.name,
        body:     r.body,
        rating:   r.rating,
        verified: r.verified,
      })),
      averageRating: agg[0]?.avg ? Math.round(agg[0].avg * 10) / 10 : null,
      totalCount,
    });
  });

  // GET /products/:productId/reviews
  app.get("/products/:productId/reviews", async (req, reply) => {
    const { productId } = req.params as any;
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = { productId };
    if (q.filter === "verified")   filter.verified = true;
    if (q.filter === "photos")     filter.photos = { $not: { $size: 0 } };
    if (q.minRating) filter.rating = { $gte: parseInt(q.minRating) };

    const sortMap: Record<string, any> = {
      recent:  { createdAt: -1 },
      rating:  { rating: -1 },
      helpful: { helpfulCount: -1 },
    };
    const sort = sortMap[q.sortBy as string] ?? { createdAt: -1 };

    const [reviews, totalCount, ratingAgg] = await Promise.all([
      Review.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { productId: require("mongoose").Types.ObjectId.createFromHexString(productId) } },
        { $group: {
          _id: null,
          avg: { $avg: "$rating" },
          dist: {
            $push: "$rating",
          },
        }},
      ]),
    ]);

    // Build star distribution
    const dist = ratingAgg[0]?.dist ?? [];
    const total = dist.length || 1;
    const ratingDistribution = [5,4,3,2,1].map(star => ({
      star,
      count: dist.filter((r: number) => r === star).length,
      pct:   Math.round(dist.filter((r: number) => r === star).length / total * 100),
    }));

    reply.send({
      reviews,
      avg: ratingAgg[0]?.avg ?? 0,
      ratingDistribution,
      ...paginationMeta(page, limit, totalCount),
    });
  });

  // POST /products/:productId/reviews
  app.post("/products/:productId/reviews", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["rating", "title", "body"],
        properties: {
          rating: { type: "number", minimum: 1, maximum: 5 },
          title:  { type: "string", minLength: 3, maxLength: 120 },
          body:   { type: "string", minLength: 10, maxLength: 2000 },
          photos: { type: "array", items: { type: "string" } },
        },
      },
    },
  }, async (req, reply) => {
    const { productId } = req.params as any;
    const { rating, title, body, photos } = req.body as any;

    const product = await Product.findById(productId);
    if (!product) return reply.status(404).send({ message: "Product not found" });

    const review = await Review.create({
      productId,
      userId:   req.user.userId,
      name:     req.user.email.split("@")[0],
      rating,
      title,
      body,
      photos:   photos ?? [],
      verified: true,
    });

    // Update product aggregate rating
    const agg = await Review.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(productId, {
      rating:       Math.round((agg[0]?.avg ?? 0) * 10) / 10,
      reviewsCount: agg[0]?.count ?? 0,
    });

    await invalidate(app, cacheKey("product", productId));

    reply.status(201).send({ review });
  });

  // GET /services/:serviceId/reviews
  app.get("/services/:serviceId/reviews", async (req, reply) => {
    const { serviceId } = req.params as any;
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = { serviceId };
    if (q.minRating) filter.rating = { $gte: parseInt(q.minRating) };

    const sort = { createdAt: -1 };

    const [reviews, totalCount, ratingAgg] = await Promise.all([
      Review.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { serviceId: require("mongoose").Types.ObjectId.createFromHexString(serviceId) } },
        { $group: { _id: null, avg: { $avg: "$rating" }, dist: { $push: "$rating" } } },
      ]),
    ]);

    const dist = ratingAgg[0]?.dist ?? [];
    const total = dist.length || 1;
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: dist.filter((r: number) => r === star).length,
      pct:   Math.round(dist.filter((r: number) => r === star).length / total * 100),
    }));

    reply.send({ reviews, avg: ratingAgg[0]?.avg ?? 0, ratingDistribution, ...paginationMeta(page, limit, totalCount) });
  });

  // POST /services/:serviceId/reviews
  app.post("/services/:serviceId/reviews", { preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["rating", "title", "body"],
        properties: {
          rating: { type: "number", minimum: 1, maximum: 5 },
          title:  { type: "string", minLength: 3, maxLength: 120 },
          body:   { type: "string", minLength: 10, maxLength: 2000 },
          photos: { type: "array", items: { type: "string" } },
        },
      },
    },
  }, async (req, reply) => {
    const { serviceId } = req.params as any;
    const { rating, title, body, photos } = req.body as any;

    const service = await Service.findById(serviceId);
    if (!service) return reply.status(404).send({ message: "Service not found" });

    const review = await Review.create({
      serviceId,
      userId:   req.user.userId,
      name:     req.user.email.split("@")[0],
      rating, title, body,
      photos:   photos ?? [],
      verified: true,
    });

    reply.status(201).send({ review });
  });

  // PUT /products/:productId/reviews/:reviewId/helpful
  app.put("/products/:productId/reviews/:reviewId/helpful", { preHandler: authenticate }, async (req, reply) => {
    const { reviewId } = req.params as any;
    const userId = req.user.userId;
    const { helpful } = req.body as any;

    const update = helpful
      ? { $addToSet: { helpfulVotes: userId }, $inc: { helpfulCount: 1 } }
      : { $pull:    { helpfulVotes: userId }, $inc: { helpfulCount: -1 } };

    const review = await Review.findByIdAndUpdate(reviewId, update, { new: true });
    if (!review) return reply.status(404).send({ message: "Review not found" });

    reply.send({ helpfulCount: review.helpfulCount });
  });
};
