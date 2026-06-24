import { FastifyPluginAsync } from "fastify";
import { pipeline } from "stream/promises";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { adminOnly } from "../../hooks/adminOnly";

// Saves into the Next.js public folder so files are served directly by Next.js
const UPLOADS_DIR = join(process.cwd(), "..", "public", "uploads");

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg"]);

export const adminUploadRoutes: FastifyPluginAsync = async (app) => {

  // POST /admin/upload — upload an image, returns { url: "/uploads/<filename>" }
  app.post("/", { preHandler: adminOnly }, async (req, reply) => {
    const data = await (req as any).file();
    if (!data) return reply.status(400).send({ message: "No file uploaded" });

    const ext = (data.filename.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return reply.status(400).send({ message: "Unsupported type. Allowed: jpg, png, gif, webp, svg" });
    }

    if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

    const filename = `${randomUUID()}.${ext}`;
    await pipeline(data.file, createWriteStream(join(UPLOADS_DIR, filename)));

    reply.send({ url: `/uploads/${filename}` });
  });
};
