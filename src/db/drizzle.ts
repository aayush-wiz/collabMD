import { drizzle } from "drizzle-orm/neon-http"; // Import the drizzle ORM client for Neon HTTP
import { neon } from "@neondatabase/serverless"; // Import the Neon serverless driver
import * as schema from "./schema"; // Import all table schemas defined in './schema.ts'
import { config } from "dotenv"; // Import the dotenv library for loading environment variables

// Load environment variables from a .env file.
// The `path: ".env"` option specifies that the file named `.env` in the current directory should be used.
config({ path: ".env" });

// Initialize the Neon serverless client.
// It connects to the PostgreSQL database using the connection string from `process.env.DATABASE_URL`.
// The `!` asserts that `DATABASE_URL` will definitely be present, which is typical after `dotenv` config.
const sql = neon(process.env.DATABASE_URL!);

// Initialize the Drizzle ORM client.
// It uses the Neon client (`sql`) and passes the imported database schema.
// This `db` object will be used to interact with the database using type-safe Drizzle queries.
export const db = drizzle(sql, { schema });
