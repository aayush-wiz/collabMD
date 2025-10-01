import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"; // Import Drizzle ORM types for PostgreSQL

/**
 * Defines the 'users' table schema for a PostgreSQL database using Drizzle ORM.
 *
 * `pgTable` is a function from Drizzle ORM that creates a table definition for PostgreSQL.
 * It takes the table name as the first argument ("users") and an object defining its columns as the second.
 */
export const users = pgTable("users", {
  /**
   * `id`: A serial primary key column.
   * `serial("id")`: Defines an auto-incrementing integer column named "id".
   * `.primaryKey()`: Designates this column as the primary key for the table.
   */
  id: serial("id").primaryKey(),

  /**
   * `username`: A text column for storing user usernames.
   * `text("username")`: Defines a text column named "username".
   * `.notNull()`: Ensures that this column cannot be null.
   * `.unique()`: Ensures that all values in this column must be unique across the table.
   */
  username: text("username").notNull().unique(),

  /**
   * `passwordHash`: A text column for storing the hashed password of the user.
   * `text("password_hash")`: Defines a text column named "password_hash".
   * `.notNull()`: Ensures that this column cannot be null.
   * Storing password hashes (not plain passwords) is a standard security practice.
   */
  passwordHash: text("password_hash").notNull(),

  /**
   * `createdAt`: A timestamp column to record when the user account was created.
   * `timestamp("created_at")`: Defines a timestamp column named "created_at".
   * `.defaultNow()`: Sets the default value of this column to the current timestamp when a new row is inserted.
   * `.notNull()`: Ensures that this column cannot be null.
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""), // Raw markdown here
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
