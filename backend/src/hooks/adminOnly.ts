import { FastifyRequest, FastifyReply } from "fastify";

export async function adminOnly(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    if (req.user.role !== "admin") {
      reply.status(403).send({ statusCode: 403, error: "Forbidden", message: "Admin access required" });
    }
  } catch {
    reply.status(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid or expired token" });
  }
}
