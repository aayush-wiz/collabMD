import { z } from "zod"; // Import the Zod library for schema validation

// Define the interface for a JWT (JSON Web Token) payload
export interface JwtPayload {
  userId: number; // The ID of the user
  iat: number; // "Issued At" - the time at which the JWT was issued, in Unix time
  exp: number; // "Expiration Time" - the time at which the JWT expires, in Unix time
}

// Define a union type for possible locations where data can be validated in an HTTP request
export type ValidatorLocation =
  | "json" // Request body as JSON
  | "form" // Request body as form data
  | "query" // URL query parameters
  | "param" // URL path parameters
  | "header" // Request headers
  | "cookie"; // Request cookies

/**
 * Defines a generic type for input and output validation using Zod.
 * @template T - The location of the data being validated (e.g., "json", "query").
 * @template S - The Zod schema used for validation.
 */
export type Input<T extends ValidatorLocation, S extends z.ZodTypeAny> = {
  // `in` represents the expected input type *before* Zod parsing (might include any type that Zod can coerce)
  in: {
    [K in T]: z.input<S>; // Map the validator location to the input type defined by the Zod schema
  };
  // `out` represents the validated output type *after* Zod parsing
  out: {
    [K in T]: z.output<S>; // Map the validator location to the output type defined by the Zod schema
  };
};

// Define the environment interface for the Hono application
export interface Env {
  Bindings: {
    // `Bindings` typically refers to environment variables or external resources accessible to the application
    JWT_SECRET: string; // The secret key used for signing and verifying JWTs
  };
  Variables: {
    // `Variables` typically refers to state that is passed between middleware or available during a request
    jwtPayload: JwtPayload; // The decoded JWT payload, which will be available after successful authentication
  };
}
