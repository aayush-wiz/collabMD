import { Hono } from "hono"; // Import the Hono framework
import authRouter from "./routes/auth"; // Import the authentication router
import { Env } from "./types"; // Import the environment type definition

// Create a new Hono application instance, specifying the environment type
const app = new Hono<Env>();

// Register the authentication router under the "/auth" path
// This means all routes defined in authRouter will be accessible via /auth/...
app.route("/auth", authRouter);

// Export the application configuration for a server (e.g., Bun, Node.js)
export default {
  port: 3000, // Specify the port the server should listen on
  fetch: app.fetch, // Export the Hono app's fetch handler to be used by the server
};
