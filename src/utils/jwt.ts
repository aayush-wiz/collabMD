/**
 * JWT (JSON Web Token) utility functions for authentication and authorization
 * 
 * This module provides helper functions to generate and verify JWT tokens
 * for user authentication in the application.
 */

import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

/**
 * Generates a JWT token for a user
 * 
 * @param userId - The unique identifier of the user
 * @param secret - The secret key used to sign the token
 * @returns A signed JWT token string
 * 
 * @example
 * const token = generateToken(123, "your-secret-key");
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 * The generated token contains:
 * - userId: The user's ID
 * - iat (issued at): Timestamp when token was created
 * - exp (expiration): Timestamp when token expires (1 hour from creation)
 */
export const generateToken = (userId: number, secret: string): string => {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
};

/**
 * Verifies and decodes a JWT token
 * 
 * @param token - The JWT token string to verify
 * @param secret - The secret key used to verify the token signature
 * @returns The decoded JWT payload containing user information
 * @throws JsonWebTokenError if the token is invalid or expired
 * 
 * @example
 * try {
 *   const payload = verifyToken(token, "your-secret-key");
 *   console.log(payload.userId); // 123
 *   console.log(payload.exp);    // Expiration timestamp
 * } catch (error) {
 *   // Handle invalid or expired token
 * }
 * 
 * The returned payload contains:
 * - userId: The user's ID
 * - iat: Issued at timestamp
 * - exp: Expiration timestamp
 */
export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
