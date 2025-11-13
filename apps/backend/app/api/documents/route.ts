import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Extract title from markdown content (first heading)
function extractTitle(content: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^#+\s+(.+)$/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "Untitled Document";
}

// Extract preview text from markdown content
function extractPreview(content: string, maxLength = 150): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/^#+\s+/gm, "") // Remove headings
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/~~(.+?)~~/g, "$1") // Remove strikethrough
    .replace(/`(.+?)`/g, "$1") // Remove inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
    .replace(/^>\s+/gm, "") // Remove blockquotes
    .replace(/^[-*+]\s+/gm, "") // Remove list markers
    .replace(/^\d+\.\s+/gm, "") // Remove numbered list markers
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}

// GET /api/documents - List all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Add preview to each document
    const documentsWithPreview = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      preview: extractPreview(doc.content),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json(documentsWithPreview);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content = "" } = body;

    const title = extractTitle(content);

    const document = await prisma.document.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

