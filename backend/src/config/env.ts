import "dotenv/config";

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port:       parseInt(optional("PORT", "3001"), 10),
  host:       optional("HOST", "0.0.0.0"),
  nodeEnv:    optional("NODE_ENV", "development"),
  isDev:      optional("NODE_ENV", "development") === "development",

  mongoUri:   optional("MONGODB_URI", "mongodb://root:rootpass@localhost:27017/artpetshop?authSource=admin"),
  redisUrl:   optional("REDIS_URL", "redis://:redispass@localhost:6379"),

  jwtSecret:  optional("JWT_SECRET", "dev_secret_change_in_prod_min_32_chars!!"),
  jwtExpiry:  optional("JWT_EXPIRES_IN", "7d"),

  corsOrigins: optional("CORS_ORIGINS", "http://localhost:3000").split(",").map(s => s.trim()),

  rateLimitMax:      parseInt(optional("RATE_LIMIT_MAX", "100"), 10),
  rateLimitWindowMs: parseInt(optional("RATE_LIMIT_WINDOW_MS", "60000"), 10),

  adminEmails: optional("ADMIN_EMAILS", "admin@artpetshop.in,deepak.v@kansoftware.com")
    .split(",").map(s => s.trim().toLowerCase()),

  taxRate:               parseFloat(optional("TAX_RATE", "0.18")),
  freeShippingThreshold: parseFloat(optional("FREE_SHIPPING_THRESHOLD", "999")),
  shippingFee:           parseFloat(optional("SHIPPING_FEE", "99")),
} as const;
