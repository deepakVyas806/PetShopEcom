import { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";
import { Cart } from "../models/Cart";
import { authenticate } from "../hooks/authenticate";

export const cartRoutes: FastifyPluginAsync = async (app) => {

  // GET /cart — return user's cart with populated product data
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate("items.productId")
      .lean();

    if (!cart) return reply.send({ items: [] });

    const items = cart.items
      .filter((i) => i.productId)
      .map((i) => ({
        product:  i.productId,
        quantity: i.quantity,
      }));

    reply.send({ items });
  });

  // POST /cart — add a product (or increment if already in cart)
  app.post(
    "/",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string" },
            quantity:  { type: "number" },
          },
        },
      },
    },
    async (req, reply) => {
      const { productId, quantity = 1 } = req.body as { productId: string; quantity?: number };

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return reply.status(400).send({ message: "Invalid productId" });
      }

      const objId = new mongoose.Types.ObjectId(productId);
      let cart = await Cart.findOne({ userId: req.user.userId });

      if (!cart) {
        cart = await Cart.create({
          userId: req.user.userId,
          items: [{ productId: objId, quantity }],
        });
      } else {
        const idx = cart.items.findIndex((i) => i.productId.toString() === productId);
        if (idx >= 0) {
          cart.items[idx].quantity += quantity;
        } else {
          cart.items.push({ productId: objId, quantity, addedAt: new Date() });
        }
        await cart.save();
      }

      reply.send({ success: true });
    }
  );

  // PATCH /cart/:productId — update quantity (quantity <= 0 removes the item)
  app.patch(
    "/:productId",
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: "object",
          required: ["quantity"],
          properties: { quantity: { type: "number" } },
        },
      },
    },
    async (req, reply) => {
      const { productId } = req.params as { productId: string };
      const { quantity }  = req.body as { quantity: number };

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return reply.status(400).send({ message: "Invalid productId" });
      }

      if (quantity <= 0) {
        await Cart.updateOne(
          { userId: req.user.userId },
          { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } }
        );
      } else {
        await Cart.updateOne(
          { userId: req.user.userId, "items.productId": new mongoose.Types.ObjectId(productId) },
          { $set: { "items.$.quantity": quantity } }
        );
      }

      reply.send({ success: true });
    }
  );

  // DELETE /cart/:productId — remove a single item
  app.delete("/:productId", { preHandler: authenticate }, async (req, reply) => {
    const { productId } = req.params as { productId: string };

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return reply.status(400).send({ message: "Invalid productId" });
    }

    await Cart.updateOne(
      { userId: req.user.userId },
      { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } }
    );

    reply.send({ success: true });
  });

  // DELETE /cart — clear entire cart
  app.delete("/", { preHandler: authenticate }, async (req, reply) => {
    await Cart.updateOne({ userId: req.user.userId }, { $set: { items: [] } });
    reply.send({ success: true });
  });
};
