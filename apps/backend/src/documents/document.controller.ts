import { Router, Request, Response } from "express";
import prisma from "../prisma/client";
import { authenticateToken, AuthRequest } from "../auth/auth.middleware";
import {
  parseGitHubUrl,
  getRepositoryInfo,
  getRepositoryStructure,
} from "../services/github.service";
import { generateMarkdownFromRepo } from "../services/openai.service";

const router = Router();

// GET /documents - List user's documents
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await prisma.document.findMany({
      where: {
        OR: [{ userId }, { isPublic: true }],
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /documents/:id - Get document by ID
router.get(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const document = await prisma.document.findFirst({
        where: {
          id,
          OR: [{ userId }, { isPublic: true }],
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /documents - Create new document
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, content, isPublic } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || content === undefined) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        userId,
        isPublic: isPublic || false,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /documents/:id - Update document
router.put(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { title, content, isPublic } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has permission to edit
      const existingDoc = await prisma.document.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!existingDoc) {
        return res
          .status(404)
          .json({ error: "Document not found or no permission" });
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      const document = await prisma.document.update({
        where: { id },
        data: updateData,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      res.json(document);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /documents/:id - Delete document
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if document exists
      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Check ownership
      if (document.userId !== userId) {
        return res.status(403).json({
          error: "You do not have permission to delete this document",
        });
      }

      await prisma.document.delete({
        where: { id },
      });

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /documents/generate-from-github - Generate markdown from GitHub repo
router.post(
  "/generate-from-github",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { githubUrl } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!githubUrl) {
        return res.status(400).json({ error: "GitHub URL is required" });
      }

      // Parse GitHub URL
      let owner: string, repo: string;
      try {
        const parsed = parseGitHubUrl(githubUrl);
        owner = parsed.owner;
        repo = parsed.repo;
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

      // Fetch repository information
      let repoInfo;
      try {
        repoInfo = await getRepositoryInfo(owner, repo);
      } catch (error: any) {
        if (error.message.includes("not found")) {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }

      // Fetch repository structure
      let structure;
      try {
        structure = await getRepositoryStructure(
          owner,
          repo,
          repoInfo.defaultBranch
        );
      } catch (error: any) {
        return res
          .status(500)
          .json({ error: `Failed to fetch repository structure: ${error.message}` });
      }

      // Generate markdown using OpenAI
      let generatedMarkdown;
      try {
        generatedMarkdown = await generateMarkdownFromRepo(repoInfo, structure);
      } catch (error: any) {
        if (error.message.includes("rate limit")) {
          return res.status(429).json({ error: error.message });
        }
        return res
          .status(500)
          .json({ error: `Failed to generate markdown: ${error.message}` });
      }

      // Create document in database
      const title = `${owner}/${repo} - Documentation`;
      const document = await prisma.document.create({
        data: {
          title,
          content: generatedMarkdown,
          userId,
          isPublic: false,
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      res.status(201).json(document);
    } catch (error) {
      console.error("Error generating document from GitHub:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const documentRouter = router;
