import { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";
import { Wishlist } from "../../models/Wishlist";
import { authenticate } from "../../hooks/authenticate";

export const wishlistRoutes: FastifyPluginAsync = async (app) => {

  // GET /wishlists — user's wishlist with populated product data
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const items = await Wishlist.find({ userId: req.user.userId })
      .populate("productId")
      .sort({ addedAt: -1 })
      .lean();

    const mapped = items
      .filter(i => i.productId)
      .map(i => ({
        ...(i.productId as any),
        _id:            (i.productId as any)._id,
        wishlistItemId: i._id,
        addedAt:        i.addedAt,
      }));

    reply.send({ items: mapped });
  });

  // GET /wishlists/check/:productId — is this product in the user's wishlist?
  app.get("/check/:productId", { preHandler: authenticate }, async (req, reply) => {
    const { productId } = req.params as { productId: string };
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return reply.send({ inWishlist: false });
    }
    const item = await Wishlist.findOne({ userId: req.user.userId, productId }).lean();
    reply.send({ inWishlist: !!item });
  });

  // POST /wishlists — add a product to wishlist
  app.post("/", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const { productId } = req.body as { productId: string };

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return reply.status(400).send({ message: "Invalid productId" });
    }

    try {
      const item = await Wishlist.create({ userId: req.user.userId, productId });
      reply.status(201).send({ item });
    } catch (err: any) {
      if (err.code === 11000) {
        return reply.status(200).send({ message: "Already in wishlist" });
      }
      throw err;
    }
  });

  // DELETE /wishlists/:productId — remove a product from wishlist
  app.delete("/:productId", { preHandler: authenticate }, async (req, reply) => {
    const { productId } = req.params as { productId: string };
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return reply.status(400).send({ message: "Invalid productId" });
    }
    await Wishlist.deleteOne({ userId: req.user.userId, productId });
    reply.send({ success: true });
  });
};
