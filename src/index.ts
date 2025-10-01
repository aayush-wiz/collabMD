import { Hono } from "hono";
import authRouter from "./routes/auth";
import docsRouter from "./routes/docs";
import { Env } from "./types";

const app = new Hono<Env>();

// Logging middleware (keep for debugging)
app.use("*", async (c, next) => {
  if (c.req.method === "POST" || c.req.method === "PUT") {
    try {
      const body = await c.req.json();
      console.log(`${c.req.method} ${c.req.url}:`, body);
    } catch (err) {
      console.error("Failed to parse JSON body:", err);
    }
  }
  await next();
});

app.route("/auth", authRouter);
app.route("/docs", docsRouter);

export default {
  port: 3000,
  fetch: app.fetch,
};
