import { Context } from "hono"; // Import the Context type from Hono
import * as bcrypt from "bcryptjs"; // Import bcryptjs for password hashing
import { z } from "zod"; // Import Zod for schema validation
import { db } from "../db/drizzle"; // Import the Drizzle database client
import { users } from "../db/schema"; // Import the 'users' table schema
import { eq } from "drizzle-orm"; // Import the 'eq' (equals) operator from Drizzle ORM
import { generateToken } from "../utils/jwt"; // Import the utility to generate JWT tokens
import { setCookie } from "hono/cookie"; // Import the utility to set cookies in Hono
import { Env, Input } from "../types"; // Import custom Env and Input types

// Define the Zod schema for user registration validation.
// It expects a username (string, min 3 characters) and a password (string, min 6 characters).
export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// Define the Zod schema for user login validation.
// It expects a username (string) and a password (string).
export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * Handles user registration.
 * - Validates the request body using `registerSchema`.
 * - Hashes the password.
 * - Inserts the new user into the database.
 * - Generates a JWT token for the new user.
 * - Sets the token as an HTTP-only cookie.
 * - Returns a success response.
 */
export const register = async (
  c: Context<Env, any, Input<"json", typeof registerSchema>> // Hono Context typed with Env and validated input
) => {
  // Extract validated username and password from the request body.
  const { username, password } = c.req.valid("json");

  // Hash the password using bcrypt with a salt round of 10.
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert the new user into the 'users' table and return the inserted user object.
  const [newUser] = await db
    .insert(users)
    .values({ username, passwordHash })
    .returning();

  // Generate a JWT token for the new user's ID using the JWT_SECRET from environment variables.
  const token = generateToken(newUser.id, process.env.JWT_SECRET!);

  // Set the generated token as an HTTP-only cookie.
  setCookie(c, "auth_token", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side scripts
    path: "/", // Makes the cookie available across the entire site
    maxAge: 3600, // Cookie expires in 1 hour (3600 seconds)
    sameSite: "Strict", // Prevents the cookie from being sent in cross-site requests
  });

  // Return a success JSON response with the user ID and a 201 Created status.
  return c.json({ message: "User registered", userId: newUser.id }, 201);
};

/**
 * Handles user login.
 * - Validates the request body using `loginSchema`.
 * - Fetches the user from the database by username.
 * - Compares the provided password with the stored hash.
 * - If credentials are valid, generates a JWT token.
 * - Sets the token as an HTTP-only cookie.
 * - Returns a success response.
 */
export const login = async (
  c: Context<Env, any, Input<"json", typeof loginSchema>> // Hono Context typed with Env and validated input
) => {
  // Extract validated username and password from the request body.
  const { username, password } = c.req.valid("json");

  // Query the database for a user with the provided username.
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  // If no user is found OR the provided password does not match the stored hash, return an unauthorized error.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Generate a JWT token for the authenticated user's ID.
  const token = generateToken(user.id, process.env.JWT_SECRET!);

  // Set the generated token as an HTTP-only cookie.
  setCookie(c, "auth_token", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side scripts
    path: "/", // Makes the cookie available across the entire site
    maxAge: 3600, // Cookie expires in 1 hour (3600 seconds)
    sameSite: "Strict", // Prevents the cookie from being sent in cross-site requests
  });

  // Return a success JSON response with the user ID.
  return c.json({ message: "Logged in", userId: user.id });
};
