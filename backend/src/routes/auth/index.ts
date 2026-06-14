import crypto from "crypto";
import { FastifyPluginAsync } from "fastify";
import { User } from "../../models/User";
import { Order } from "../../models/Order";
import { Wishlist } from "../../models/Wishlist";
import { env } from "../../config/env";
import { authenticate } from "../../hooks/authenticate";

export const authRoutes: FastifyPluginAsync = async (app) => {

  // POST /auth/signup
  app.post("/signup", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
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
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, mobile: user.mobile, petPrefs: user.petPrefs },
    });
  });

  // POST /auth/login
  app.post("/login", {
    config: { rateLimit: { max: 10, timeWindow: "15 minutes" } },
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
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, mobile: user.mobile, petPrefs: user.petPrefs },
    });
  });

  // POST /auth/google — OAuth via Google access token
  app.post("/google", {
    config: { rateLimit: { max: 10, timeWindow: "15 minutes" } },
    schema: {
      body: {
        type: "object",
        required: ["access_token"],
        properties: {
          access_token: { type: "string", minLength: 10, maxLength: 2048 },
        },
      },
    },
  }, async (req, reply) => {
    const { access_token } = req.body as { access_token: string };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    let resp: Response;
    try {
      resp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
        signal: controller.signal,
      });
    } catch {
      return reply.status(502).send({ statusCode: 502, error: "Bad Gateway", message: "Could not reach Google. Please try again." });
    } finally {
      clearTimeout(timer);
    }

    if (!resp.ok) {
      return reply.status(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid or expired Google token" });
    }

    const gUser = await resp.json() as {
      id?: string;
      email?: string;
      name?: string;
      picture?: string;
      verified_email?: boolean;
    };

    if (!gUser.email || !gUser.verified_email) {
      return reply.status(401).send({ statusCode: 401, error: "Unauthorized", message: "Google account does not have a verified email" });
    }

    if (!gUser.id) {
      return reply.status(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid Google account data" });
    }

    const email = gUser.email.toLowerCase().trim();
    const name  = (gUser.name ?? email.split("@")[0]).trim().slice(0, 80);

    let user = await User.findOne({ email });

    if (!user) {
      const role = env.adminEmails.includes(email) ? "admin" : "customer";
      try {
        user = await User.create({
          name,
          email,
          password: gUser.id + "_google_oauth_not_usable",
          role,
          avatar: gUser.picture,
        });
      } catch (err: any) {
        if (err.code === 11000) {
          user = await User.findOne({ email });
          if (!user) throw err;
        } else {
          throw err;
        }
      }
    }

    const token = app.jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role });

    reply.send({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, mobile: user.mobile, petPrefs: user.petPrefs },
    });
  });

  // GET /auth/me
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
    await User.findByIdAndUpdate(req.user.userId, updates, { runValidators: true });
    reply.send({ success: true });
  });

  // POST /auth/forgot-password — generate reset token and (in prod) email it
  app.post("/forgot-password", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
    schema: {
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
    },
  }, async (req, reply) => {
    const { email } = req.body as { email: string };

    const user = await User.findOne({ email: email.toLowerCase() }).select("+resetToken +resetTokenExpiry");
    if (user) {
      const token  = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      user.resetToken       = token;
      user.resetTokenExpiry = expiry;
      await user.save({ validateModifiedOnly: true });
      // In production: send email with reset link containing this token.
      // For development, the token is logged here:
      app.log.info({ resetToken: token, email: user.email }, "Password reset token generated");
    }

    // Always return success to prevent user enumeration
    reply.send({ message: "If an account with that email exists, a reset link has been sent." });
  });

  // POST /auth/reset-password — consume token and set new password
  app.post("/reset-password", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
    schema: {
      body: {
        type: "object",
        required: ["token", "newPassword"],
        properties: {
          token:       { type: "string", minLength: 1 },
          newPassword: { type: "string", minLength: 6 },
        },
      },
    },
  }, async (req, reply) => {
    const { token, newPassword } = req.body as { token: string; newPassword: string };

    const user = await User.findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+resetToken +resetTokenExpiry +password");

    if (!user) {
      return reply.status(400).send({ message: "Reset link is invalid or has expired." });
    }

    user.password           = newPassword;
    user.resetToken         = undefined;
    user.resetTokenExpiry   = undefined;
    await user.save();

    reply.send({ message: "Password updated successfully. You can now sign in." });
  });

  // PUT /auth/change-password — change password for authenticated user
  app.put("/change-password", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldPassword: { type: "string", minLength: 1 },
          newPassword: { type: "string", minLength: 6 },
        },
      },
    },
  }, async (req, reply) => {
    const { oldPassword, newPassword } = req.body as any;

    const user = await User.findById(req.user.userId).select("+password");
    if (!user) return reply.status(404).send({ message: "User not found" });

    const valid = await user.comparePassword(oldPassword);
    if (!valid) {
      return reply.status(401).send({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    reply.send({ success: true });
  });

  // GET /auth/stats — aggregate counts for the profile page
  app.get("/stats", { preHandler: authenticate }, async (req, reply) => {
    const userId = req.user.userId;

    const [wishlistCount, ordersCount, pendingCount] = await Promise.all([
      Wishlist.countDocuments({ userId }),
      Order.countDocuments({ userId }),
      Order.countDocuments({ userId, status: { $in: ["Confirmed", "Processing"] } }),
    ]);

    reply.send({
      wishlistCount,
      ordersCount,
      pendingCount,
      rewardPoints: 0,
    });
  });
};
