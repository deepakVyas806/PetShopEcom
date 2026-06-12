import fp from "fastify-plugin";
import Redis from "ioredis";
import { FastifyPluginAsync } from "fastify";
import { env } from "../config/env";

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  const redis = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: true,
    reconnectOnError: (err) => {
      const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  await redis.connect();
  app.log.info("Redis connected");

  app.decorate("redis", redis);

  app.addHook("onClose", async () => {
    await redis.quit();
    app.log.info("Redis disconnected");
  });
};

export const redisPlugin = fp(plugin, { name: "redis" });
