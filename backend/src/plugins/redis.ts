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
    maxRetriesPerRequest: 0,
    lazyConnect: true,
    enableReadyCheck: false,
    enableOfflineQueue: false,
    retryStrategy: () => null,        // disable automatic reconnect
    reconnectOnError: () => false,
  });

  // Prevent ioredis from crashing the process with unhandled error events
  redis.on("error", () => {});

  try {
    await redis.connect();
    app.log.info("Redis connected");
  } catch {
    app.log.warn("Redis unavailable — caching disabled (OK for dev)");
  }

  app.decorate("redis", redis);

  app.addHook("onClose", async () => {
    try { await redis.quit(); } catch {}
  });
};

export const redisPlugin = fp(plugin, { name: "redis" });
