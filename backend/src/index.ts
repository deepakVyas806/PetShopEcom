import { buildApp } from "./app";
import { env } from "./config/env";

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: env.host });
    console.log(`\n🚀  ArtPetShop API ready at http://${env.host}:${env.port}`);
    console.log(`📋  Health: http://localhost:${env.port}/health`);
    console.log(`📦  MongoDB + Redis connected\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
