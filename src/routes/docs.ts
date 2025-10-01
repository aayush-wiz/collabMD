import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  createDocSchema,
  updateDocSchema,
} from "../controllers/docs";
import { authMiddleware } from "../middleware/auth";
import { Env } from "../types";

const docsRouter = new Hono<Env>();

// Apply auth middleware to all routes
docsRouter.use("/*", authMiddleware);

// Create a new document
docsRouter.post("/", zValidator("json", createDocSchema), createDocument);

// List user's documents
docsRouter.get("/", getDocuments);

// Get a specific document
docsRouter.get("/:id", getDocument);

// Update a document
docsRouter.put("/:id", zValidator("json", updateDocSchema), updateDocument);

// Delete a document
docsRouter.delete("/:id", deleteDocument);

export default docsRouter;
