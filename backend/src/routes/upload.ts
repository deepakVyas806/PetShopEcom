import { FastifyPluginAsync } from "fastify";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { authenticate } from "../hooks/authenticate";

// ── Cloudinary ────────────────────────────────────────────────────────────────
let cloudinary: any = null;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  const { v2 } = require("cloudinary");
  v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinary = v2;
}

// ── Local filesystem fallback (dev only) ──────────────────────────────────────
const UPLOADS_ROOT   = join(process.cwd(), "..", "public", "uploads");
const ALLOWED_EXT    = new Set(["jpg", "jpeg", "png", "gif", "webp"]);
const USER_CONTEXTS  = new Set(["avatar"]);
const ADMIN_CONTEXTS = new Set(["hero", "catalog", "product", "service", "offer", "general"]);

function cloudinaryUpload(buffer: Buffer, folder: string, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: "image", overwrite: true },
      (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export const uploadRoutes: FastifyPluginAsync = async (app) => {

  app.post("/", { preHandler: authenticate }, async (req, reply) => {
    const parts = (req as any).parts();

    let fileBuffer: Buffer | null = null;
    let filename = "";
    let context  = "general";

    // Buffer the file INLINE during iteration — don't store the stream reference
    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "file") {
        filename = part.filename ?? "upload";
        const chunks: Buffer[] = [];
        for await (const chunk of part.file) {
          chunks.push(chunk as Buffer);
        }
        fileBuffer = Buffer.concat(chunks);
      } else if (part.type === "field" && part.fieldname === "context") {
        context = String(part.value).toLowerCase().trim();
      }
    }

    if (!fileBuffer || !fileBuffer.length) {
      return reply.status(400).send({ message: "No file uploaded" });
    }

    const { userId, role } = (req as any).user;

    const isUserCtx  = USER_CONTEXTS.has(context);
    const isAdminCtx = ADMIN_CONTEXTS.has(context);

    if (!isUserCtx && !isAdminCtx) {
      return reply.status(400).send({ message: `Unknown upload context: ${context}` });
    }
    if (isAdminCtx && role !== "admin") {
      return reply.status(403).send({ message: `Context "${context}" requires admin access` });
    }

    const ext = (filename.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return reply.status(400).send({ message: "Unsupported file type. Allowed: jpg, png, gif, webp" });
    }

    const uniqueId = randomUUID();

    // ── Cloudinary ─────────────────────────────────────────────────────────────
    if (cloudinary) {
      const folder = isUserCtx
        ? `petshop/users/${userId}`
        : `petshop/admin/${context}`;
      try {
        const url = await cloudinaryUpload(fileBuffer, folder, uniqueId);
        return reply.send({ url });
      } catch (err: any) {
        return reply.status(500).send({ message: "Upload failed: " + (err?.message ?? "Unknown error") });
      }
    }

    // ── Local filesystem fallback ──────────────────────────────────────────────
    const targetDir = isUserCtx
      ? join(UPLOADS_ROOT, "users", userId)
      : join(UPLOADS_ROOT, "admin", context);

    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

    const outFilename = `${uniqueId}.${ext}`;
    const outPath     = join(targetDir, outFilename);

    await new Promise<void>((resolve, reject) => {
      const ws = createWriteStream(outPath);
      ws.on("finish", resolve);
      ws.on("error", reject);
      ws.end(fileBuffer);
    });

    const url = isUserCtx
      ? `/uploads/users/${userId}/${outFilename}`
      : `/uploads/admin/${context}/${outFilename}`;

    reply.send({ url });
  });
};
