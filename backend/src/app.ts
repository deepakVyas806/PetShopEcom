import Fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { env } from "./config/env";
import { mongoPlugin } from "./plugins/mongodb";
import { redisPlugin } from "./plugins/redis";
import { jwtPlugin } from "./plugins/jwt";
import { registerRoutes } from "./routes";

export async function buildApp() {
  const app = Fastify({
    logger: env.isDev
      ? { transport: { target: "pino-pretty", options: { colorize: true } } }
      : true,
    trustProxy: true,
    bodyLimit: 4 * 1024 * 1024, // 4 MB — needed for base64-encoded avatar uploads
    // Fastify's built-in JSON schema serializer (fast-json-stringify) — no extra config needed
    ajv: {
      customOptions: {
        removeAdditional: "all",   // strip undeclared fields automatically
        coerceTypes: "array",      // coerce query param types
        useDefaults: true,
      },
    },
  });

  // ── Security ────────────────────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // Frontend handles CSP
  });

  await app.register(cors, {
    origin: env.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // ── Performance ─────────────────────────────────────────────────────────────
  // @fastify/compress v8 causes premature-close / empty responses on Node 20+ Windows.
  // Compression is handled by the reverse proxy (nginx/CDN) in production.
  await app.register(rateLimit, {
    max: env.rateLimitMax,
    timeWindow: env.rateLimitWindowMs,
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: "Slow down — too many requests. Please wait before retrying.",
    }),
  });

  // ── File uploads ────────────────────────────────────────────────────────────
  await app.register(multipart, {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  });

  // ── Data stores ─────────────────────────────────────────────────────────────
  await app.register(mongoPlugin);
  await app.register(redisPlugin);
  await app.register(jwtPlugin);

  // ── Routes ──────────────────────────────────────────────────────────────────
  await app.register(registerRoutes, { prefix: "/api/v1" });

  // ── Health check ────────────────────────────────────────────────────────────
  app.get("/health", { logLevel: "silent" }, async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // ── Global error handler ─────────────────────────────────────────────────
  app.setErrorHandler((error: any, _req, reply) => {
    const statusCode = (error as any).statusCode ?? 500;
    app.log.error(error);
    reply.status(statusCode).send({
      statusCode,
      error: (error as any).name ?? "Error",
      message: statusCode === 500 && !env.isDev
        ? "Internal server error"
        : (error as any).message ?? "Unknown error",
    });
  });

  return app;
}
