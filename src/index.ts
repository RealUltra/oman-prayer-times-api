import { Hono } from "hono";
import citiesRoute from "./routes/cities";
import prayerTimesRoute from "./routes/prayer-times";

const app = new Hono();

// Index route
app.get("/", (c) => {
  return c.json({ status: "Server is up and running!" });
});

// Register routes
app.route("/api/v1", citiesRoute);
app.route("/api/v1", prayerTimesRoute);

export default app;
