import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyPluginAsync } from "fastify";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  email:  string;
  role:   "customer" | "admin";
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user:    JwtPayload;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(fastifyJwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: env.jwtExpiry },
  });
};

export const jwtPlugin = fp(plugin, { name: "jwt" });
