import fp from "fastify-plugin";
import mongoose from "mongoose";
import { FastifyPluginAsync } from "fastify";
import { env } from "../config/env";

const plugin: FastifyPluginAsync = async (app) => {
  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  app.log.info("MongoDB connected");

  app.addHook("onClose", async () => {
    await mongoose.disconnect();
    app.log.info("MongoDB disconnected");
  });
};

export const mongoPlugin = fp(plugin, { name: "mongodb" });
