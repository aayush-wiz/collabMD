"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Workspace } from "../../../components/editor/workspace";
import { useEditorContext } from "../../../components/editor/editor-context";
import { useTheme } from "../../../providers/theme-provider";
import { documentApi } from "../../../lib/api-client";
import { useDocumentTitle } from "../../../components/editor/document-title-context";

export default function EditorPage() {
  const params = useParams();
  const { setMarkdown, setDocumentId } = useEditorContext();
  const { setDocumentTitle } = useDocumentTitle();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const id = String(params.id);
        const doc = await documentApi.get(id);
        if (doc) {
          setMarkdown(doc.content);
          setDocumentId(doc.id);
          // Set document title from API response
          if (doc.title) {
            setDocumentTitle(doc.title);
          }
        } else {
          setError("Document not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load document");
        console.error("Error loading document:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id, setMarkdown, setDocumentId, setDocumentTitle]);

  if (loading) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          backgroundColor: theme === "dark" ? "#111111" : "#FAFAFA",
          color: theme === "dark" ? "#A6A6A6" : "#5A5A5A",
        }}
      >
        Loading document...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          backgroundColor: theme === "dark" ? "#111111" : "#FAFAFA",
          color: "#DC2626",
        }}
      >
        {error}
      </div>
    );
  }

  return <Workspace />;
}
