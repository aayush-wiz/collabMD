import { Context, Next } from "hono"; // Import Context and Next types from Hono
import { getCookie } from "hono/cookie"; // Import getCookie utility from hono/cookie
import { verifyToken } from "../utils/jwt"; // Import the verifyToken utility function
import { Env, JwtPayload } from "../types"; // Import custom Env and JwtPayload types

/**
 * Middleware to authenticate requests using a JWT stored in a cookie.
 * It verifies the token and attaches the decoded payload to the Hono context.
 *
 * @param c - The Hono Context object, which includes request, response, environment, and state.
 * @param next - The `next` function to call the next middleware or route handler in the chain.
 */
export const authMiddleware = async (c: Context<Env>, next: Next) => {
  // Attempt to retrieve the authentication token from the "auth_token" cookie.
  const token = getCookie(c, "auth_token");

  // If no token is found in the cookie, return an unauthorized error.
  if (!token) {
    return c.json({ error: "Unauthorized: No token provided" }, 401);
  }

  try {
    // Verify the retrieved token using the JWT_SECRET from the environment.
    // `process.env.JWT_SECRET!` is used here, assuming JWT_SECRET is always defined in the environment.
    const payload = verifyToken(token, process.env.JWT_SECRET!);

    // If verification is successful, set the decoded JWT payload into the Hono context variables.
    // This payload will then be accessible by subsequent middleware or the route handler.
    c.set("jwtPayload", payload as JwtPayload);

    // Call the next middleware or the route handler.
    await next();
  } catch (err) {
    // If token verification fails (e.g., expired, invalid signature), return an unauthorized error.
    return c.json({ error: "Unauthorized: Invalid token" }, 401);
  }
};
