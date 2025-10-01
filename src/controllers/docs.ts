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
  const userId = c.get("jwtPayload").userId;

  const userDocs = await db
    .select()
    .from(documents)
    .where(eq(documents.ownerId, userId))
    .orderBy(documents.createdAt);

  return c.json(userDocs);
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
