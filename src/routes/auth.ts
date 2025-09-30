import { Hono } from "hono"; // Import the Hono framework for creating web applications
import { zValidator } from "@hono/zod-validator"; // Import Zod validator middleware for Hono
import {
  register, // Import the register controller function
  login, // Import the login controller function
  registerSchema, // Import the Zod schema for user registration validation
  loginSchema, // Import the Zod schema for user login validation
} from "../controllers/auth"; // Path to the authentication controller functions and schemas
import { authMiddleware } from "../middleware/auth"; // Import the authentication middleware
import { Env } from "../types"; // Import the custom environment type definition

// Create a new Hono router instance specifically for authentication routes.
// The router is typed to ensure type safety for environment bindings and variables.
const authRouter = new Hono<{
  Bindings: Env["Bindings"]; // Specify that this router will use the Bindings defined in Env
  Variables: Env["Variables"]; // Specify that this router will use the Variables defined in Env
}>();

// Define a POST route for user registration.
// It uses `zValidator("json", registerSchema)` to validate the request body against `registerSchema` before calling the `register` controller.
authRouter.post("/register", zValidator("json", registerSchema), register);

// Define a POST route for user login.
// It uses `zValidator("json", loginSchema)` to validate the request body against `loginSchema` before calling the `login` controller.
authRouter.post("/login", zValidator("json", loginSchema), login);

// Define a GET route for a protected resource.
// It applies the `authMiddleware` first to verify the JWT.
// If authentication is successful, the `jwtPayload` (containing userId) is available in `c.get("jwtPayload")`.
authRouter.get("/protected", authMiddleware, async (c) => {
  // Extract the userId from the jwtPayload that was set by the authMiddleware
  const userId = c.get("jwtPayload").userId;
  // Return a JSON response indicating successful access to the protected route and the user ID
  return c.json({ message: "Protected route accessed", userId });
});

export default authRouter; // Export the configured authentication router
