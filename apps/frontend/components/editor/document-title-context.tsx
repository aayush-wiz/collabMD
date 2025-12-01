"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { documentApi } from "../../lib/api-client";

interface DocumentTitleContextValue {
  documentTitle: string | null;
  documentId: string | null;
  setDocumentTitle: (title: string) => void;
  setDocumentId: (id: string | null) => void;
  updateDocumentTitle: (title: string) => Promise<void>;
}

const DocumentTitleContext = createContext<DocumentTitleContextValue | null>(
  null
);

export function DocumentTitleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [documentTitle, setDocumentTitleState] = useState<string | null>(null);
  const [documentId, setDocumentIdState] = useState<string | null>(null);

  // Load title from API when documentId changes
  useEffect(() => {
    if (!documentId) {
      setDocumentTitleState(null);
      return;
    }

    const loadDocumentTitle = async () => {
      try {
        const doc = await documentApi.get(documentId);
        if (doc && doc.title) {
          setDocumentTitleState(doc.title);
        }
      } catch (error) {
        console.error("Error loading document title:", error);
        // Keep existing title on error
      }
    };

    loadDocumentTitle();
  }, [documentId]);

  const setDocumentTitle = useCallback((title: string) => {
    setDocumentTitleState(title);
  }, []);

  const setDocumentId = useCallback((id: string | null) => {
    setDocumentIdState(id);
    // Reset title when documentId is cleared
    if (!id) {
      setDocumentTitleState(null);
    }
  }, []);

  const updateDocumentTitle = useCallback(
    async (title: string) => {
      // Update local state immediately
      setDocumentTitleState(title);

      // Update via API if documentId exists
      if (documentId) {
        try {
          await documentApi.update(documentId, { title });
        } catch (error) {
          console.error("Error updating document title:", error);
          // Optionally revert on error or show error message
          throw error;
        }
      }
    },
    [documentId]
  );

  const value: DocumentTitleContextValue = {
    documentTitle,
    documentId,
    setDocumentTitle,
    setDocumentId,
    updateDocumentTitle,
  };

  return (
    <DocumentTitleContext.Provider value={value}>
      {children}
    </DocumentTitleContext.Provider>
  );
}

export function useDocumentTitle() {
  const context = useContext(DocumentTitleContext);
  if (!context) {
    throw new Error(
      "useDocumentTitle must be used within a DocumentTitleProvider"
    );
  }
  return context;
}

