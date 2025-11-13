"use client";

import { useEffect, useState } from "react";
import { DocumentCard } from "../../components/workspace/document-card";
import { WorkspaceHeader } from "../../components/workspace/workspace-header";
import { useTheme } from "../../providers/theme-provider";
import { api } from "../../lib/api-client";

interface Document {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/api/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await api.delete(`/api/documents/${id}`);
      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <main
      className="flex h-full flex-col"
      style={{
        backgroundColor: theme === "dark" ? "#111111" : "#FAFAFA",
      }}
    >
      <WorkspaceHeader />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div
            className="flex h-full items-center justify-center"
            style={{ color: theme === "dark" ? "#A6A6A6" : "#5A5A5A" }}
          >
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div
            className="flex h-full flex-col items-center justify-center"
            style={{ color: theme === "dark" ? "#A6A6A6" : "#5A5A5A" }}
          >
            <p className="mb-4 text-lg">No documents yet</p>
            <p className="text-sm">
              Click &quot;New Document&quot; to create your first markdown
              document
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                preview={doc.preview}
                createdAt={doc.createdAt}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

