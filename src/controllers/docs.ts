import { Context } from "hono";
import { z } from "zod";
import { db } from "../db/drizzle";
import { documents, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { Env, Input } from "../types";

export const createDocSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().max(1000000), // ~1MB limit for markdown
});

export const updateDocSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().max(1000000),
});

export const createDocument = async (
  c: Context<Env, any, Input<"json", typeof createDocSchema>>
) => {
  const { title, content } = c.req.valid("json");
  const userId = c.get("jwtPayload").userId;

  const [newDoc] = await db
    .insert(documents)
    .values({ title, content, ownerId: userId })
    .returning();

  return c.json(newDoc, 201);
};

export const getDocuments = async (c: Context<Env>) => {
  try {
    // Extract user ID from JWT payload with validation
    const jwtPayload = c.get("jwtPayload");
    if (!jwtPayload || !jwtPayload.userId) {
      return c.json({ error: "Invalid authentication payload" }, 401);
    }

    const userId = jwtPayload.userId;

    // Validate userId is a valid number
    if (typeof userId !== "number" || userId <= 0) {
      return c.json({ error: "Invalid user ID format" }, 400);
    }

    // Fetch user's documents from database
    const userDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.ownerId, userId))
      .orderBy(documents.createdAt);

    // Return empty array if no documents found (this is valid, not an error)
    return c.json(userDocs || []);
  } catch (error) {
    // Log the error for debugging (in production, use proper logging service)
    console.error("Error fetching documents:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Database connection errors
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("connection")
      ) {
        return c.json({ error: "Database connection failed" }, 503);
      }

      // SQL query errors
      if (error.message.includes("syntax") || error.message.includes("SQL")) {
        return c.json({ error: "Database query error" }, 500);
      }
    }

    // Generic error response for unexpected errors
    return c.json({ error: "Failed to fetch documents" }, 500);
  }
};

export const getDocument = async (c: Context<Env>) => {
  const userId = c.get("jwtPayload").userId;
  const id = parseInt(c.req.param("id"));

  const [doc] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.ownerId, userId)));

  if (!doc) {
    return c.json({ error: "Document not found or unauthorized" }, 404);
  }

  return c.json(doc);
};

export const updateDocument = async (
  c: Context<Env, any, Input<"json", typeof updateDocSchema>>
) => {
  const { title, content } = c.req.valid("json");
  const userId = c.get("jwtPayload").userId;
  const id = parseInt(c.req.param("id"));

  const [existingDoc] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.ownerId, userId)));

  if (!existingDoc) {
    return c.json({ error: "Document not found or unauthorized" }, 404);
  }

  const updatedDoc = await db
    .update(documents)
    .set({
      ...(title !== undefined ? { title } : {}),
      content,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, id))
    .returning();

  return c.json(updatedDoc[0]);
};

export const deleteDocument = async (c: Context<Env>) => {
  const userId = c.get("jwtPayload").userId;
  const id = parseInt(c.req.param("id"));

  const [existingDoc] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.ownerId, userId)));

  if (!existingDoc) {
    return c.json({ error: "Document not found or unauthorized" }, 404);
  }

  await db.delete(documents).where(eq(documents.id, id));

  return c.json({ message: "Document deleted" });
};
