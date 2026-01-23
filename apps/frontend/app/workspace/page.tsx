"use client";

import { useEffect, useState } from "react";
import { DocumentCard } from "../../components/workspace/document-card";
import { WorkspaceHeader } from "../../components/workspace/workspace-header";
import { GitHubImportModal } from "../../components/workspace/github-import-modal";
import { useTheme } from "../../providers/theme-provider";
import { documentApi } from "../../lib/api-client";
import Link from "next/link";
import { useAuth } from "../../providers/auth-provider";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Not authenticated; stop loading and show login prompt
      setLoading(false);
      return;
    }
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentApi.list();
      setDocuments(data);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await documentApi.delete(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: any) {
      console.error("Error deleting document:", err);
      setError(err.message || "Failed to delete document");
    }
  };

  const handleRenameDocument = async (id: string, newTitle: string) => {
    try {
      await documentApi.update(id, { title: newTitle });
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, title: newTitle } : doc))
      );
    } catch (err: any) {
      console.error("Error renaming document:", err);
      setError(err.message || "Failed to rename document");
    }
  };

  const handleGitHubImportSuccess = async (documentId: string) => {
    // Refresh the documents list
    await fetchDocuments();
    // Navigate to the newly created document
    router.push(`/editor/${documentId}`);
  };

  return (
    <main
      className="flex h-full flex-col"
      style={{
        backgroundColor: theme === "dark" ? "#111111" : "#FAFAFA",
      }}
    >
      <WorkspaceHeader onOpenGitHubImport={() => setIsGitHubModalOpen(true)} />
      <GitHubImportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSuccess={handleGitHubImportSuccess}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {!user && !isLoading && (
          <div
            className="flex h-full flex-col items-center justify-center gap-3"
            style={{ color: theme === "dark" ? "#A6A6A6" : "#5A5A5A" }}
          >
            <p className="text-lg">You need to login in to see your markdown</p>
            <Link
              href="/signin"
              className="rounded-lg px-4 py-2 font-medium transition-all text-white"
              style={{
                backgroundColor: theme === "dark" ? "#4DA6FF" : "#007ACC",
              }}
            >
              Login
            </Link>
          </div>
        )}

        {user && (
          <>
            {error && (
              <div
                className="mb-4 rounded-md p-4 text-sm"
                style={{
                  backgroundColor: theme === "dark" ? "#DC2626" : "#FEE2E2",
                  color: theme === "dark" ? "#FECACA" : "#DC2626",
                }}
              >
                {error}
              </div>
            )}

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
                    preview={doc.content.substring(0, 150)}
                    createdAt={doc.createdAt}
                    onDelete={handleDeleteDocument}
                    onRename={handleRenameDocument}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
