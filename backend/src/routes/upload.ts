import { FastifyPluginAsync } from "fastify";
import { pipeline } from "stream/promises";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { authenticate } from "../hooks/authenticate";

const UPLOADS_ROOT = join(process.cwd(), "..", "public", "uploads");

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp"]);

// Contexts any authenticated user may use
const USER_CONTEXTS = new Set(["avatar"]);

// Contexts reserved for admins
const ADMIN_CONTEXTS = new Set(["hero", "catalog", "product", "service", "offer", "general"]);

function resolveDir(context: string, userId: string, role: string): string | null {
  if (USER_CONTEXTS.has(context)) {
    // User images go into uploads/users/<userId>/
    return join(UPLOADS_ROOT, "users", userId);
  }
  if (ADMIN_CONTEXTS.has(context)) {
    if (role !== "admin") return null; // forbidden
    // Admin images go into uploads/admin/<context>/
    return join(UPLOADS_ROOT, "admin", context);
  }
  return null; // unknown context
}

function resolveUrlPath(context: string, userId: string, filename: string): string {
  if (USER_CONTEXTS.has(context)) {
    return `/uploads/users/${userId}/${filename}`;
  }
  return `/uploads/admin/${context}/${filename}`;
}

export const uploadRoutes: FastifyPluginAsync = async (app) => {

  // POST /upload
  // FormData fields:
  //   file    — the image file
  //   context — where to store: "avatar" (any user) | "hero" | "catalog" | "product" | "service" | "offer" | "general" (admin only)
  app.post("/", { preHandler: authenticate }, async (req, reply) => {
    const parts = (req as any).parts();

    let fileData: any = null;
    let context = "general";

    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        fileData = part;
      } else if (part.type === "field" && part.fieldname === "context") {
        context = String(part.value).toLowerCase().trim();
      }
    }

    if (!fileData) {
      return reply.status(400).send({ message: "No file uploaded" });
    }

    const { userId, role } = (req as any).user;

    const targetDir = resolveDir(context, userId, role);
    if (!targetDir) {
      return reply.status(403).send({
        message: context === "avatar" || USER_CONTEXTS.has(context)
          ? "Forbidden"
          : `Context "${context}" requires admin access`,
      });
    }

    const ext = (fileData.filename.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return reply.status(400).send({ message: "Unsupported file type. Allowed: jpg, png, gif, webp" });
    }

    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

    const filename = `${randomUUID()}.${ext}`;
    await pipeline(fileData.file, createWriteStream(join(targetDir, filename)));

    const url = resolveUrlPath(context, userId, filename);
    reply.send({ url });
  });
};
