import { FastifyInstance } from "fastify";

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Get a cached value or compute it.
 * If the key exists in Redis, returns it immediately (no DB hit).
 * Otherwise calls `fn()`, caches the result, and returns it.
 */
export async function cached<T>(
  app: FastifyInstance,
  key: string,
  fn: () => Promise<T>,
  ttl = DEFAULT_TTL
): Promise<T> {
  const hit = await app.redis.get(key);
  if (hit) return JSON.parse(hit) as T;

  const result = await fn();
  await app.redis.setex(key, ttl, JSON.stringify(result));
  return result;
}

/** Invalidate one or more cache keys (supports wildcard patterns via SCAN). */
export async function invalidate(app: FastifyInstance, ...keys: string[]) {
  if (keys.length === 0) return;
  await app.redis.del(...keys);
}

/** Invalidate all keys matching a pattern (e.g. "products:*"). */
export async function invalidatePattern(app: FastifyInstance, pattern: string) {
  let cursor = "0";
  do {
    const [nextCursor, keys] = await app.redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
    cursor = nextCursor;
    if (keys.length > 0) await app.redis.del(...keys);
  } while (cursor !== "0");
}

/** Build a cache key from parts. */
export function cacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(":");
}
