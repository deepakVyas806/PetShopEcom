import { FastifyPluginAsync } from "fastify";
import { User } from "../../models/User";
import { env } from "../../config/env";
import { authenticate } from "../../hooks/authenticate";

export const authRoutes: FastifyPluginAsync = async (app) => {

  // POST /auth/signup
  app.post("/signup", {
    schema: {
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name:     { type: "string", minLength: 2, maxLength: 80 },
          email:    { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          mobile:   { type: "string" },
          petPrefs: { type: "array", items: { type: "string" } },
        },
      },
    },
  }, async (req, reply) => {
    const { name, email, password, mobile, petPrefs } = req.body as any;

    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return reply.status(409).send({ statusCode: 409, error: "Conflict", message: "Email already registered" });
    }

    const role = env.adminEmails.includes(email.toLowerCase()) ? "admin" : "customer";
    const user = await User.create({ name, email, password, mobile, petPrefs, role });

    const token = app.jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role });

    reply.status(201).send({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  });

  // POST /auth/login
  app.post("/login", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email:    { type: "string", format: "email" },
          password: { type: "string", minLength: 1 },
        },
      },
    },
  }, async (req, reply) => {
    const { email, password } = req.body as any;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return reply.status(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid credentials" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return reply.status(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid credentials" });
    }

    const token = app.jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role });

    reply.send({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  });

  // GET /auth/me — returns current user (requires token)
  app.get("/me", { preHandler: authenticate }, async (req, reply) => {
    const user = await User.findById(req.user.userId).lean();
    if (!user) return reply.status(404).send({ message: "User not found" });
    reply.send({ user });
  });

  // PUT /auth/me — update profile
  app.put("/me", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        properties: {
          name:     { type: "string", minLength: 2, maxLength: 80 },
          mobile:   { type: "string" },
          petPrefs: { type: "array", items: { type: "string" } },
          avatar:   { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const updates = req.body as any;
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, runValidators: true }).lean();
    reply.send({ user });
  });
};
