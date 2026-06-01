import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import prayerTimesRoute from "./routes/prayer-times";
import citiesRoute from "./routes/cities";
import { REQUESTS_PER_MIN } from "./constants";

const server = Fastify({
  logger: true,
});

// Index route
server.get("/", (request, reply) => {
  return { status: "Server is up and running!" };
});

// Rate limiting
await server.register(rateLimit, {
  max: REQUESTS_PER_MIN,
  timeWindow: "1 minute",
});

// Register routes
server.register(prayerTimesRoute, { prefix: "/api/v1" });
server.register(citiesRoute, { prefix: "/api/v1" });

// Start server
async function startServer() {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
