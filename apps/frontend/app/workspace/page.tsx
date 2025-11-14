"use client";

import { useEffect, useState } from "react";
import { DocumentCard } from "../../components/workspace/document-card";
import { WorkspaceHeader } from "../../components/workspace/workspace-header";
import { useTheme } from "../../providers/theme-provider";
import { localDocs } from "../../lib/local-docs";
import { DEFAULT_MARKDOWN } from "../../components/editor/editor-context";

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
    // LocalStorage fetch is synchronous
    const data = localDocs.list();
    if (data.length === 0) {
      // Seed a starter template on first visit
      localDocs.create(DEFAULT_MARKDOWN);
      setDocuments(localDocs.list());
    } else {
      setDocuments(data);
    }
    setLoading(false);
  };

  const handleDeleteDocument = async (id: string) => {
    localDocs.remove(id);
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleRenameDocument = (id: string, newTitle: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, title: newTitle } : doc))
    );
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
                onRename={handleRenameDocument}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
