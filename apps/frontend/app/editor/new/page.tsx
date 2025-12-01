"use client";

import { useEffect, useRef } from "react";
import { Workspace } from "../../../components/editor/workspace";
import { useEditorContext } from "../../../components/editor/editor-context";
import { useDocumentTitle } from "../../../components/editor/document-title-context";

export default function NewEditorPage() {
  const { setMarkdown, setDocumentId } = useEditorContext();
  const {
    setDocumentId: setTitleDocumentId,
    setDocumentTitle,
  } = useDocumentTitle();

  // Reset local editor state for a brand new document
  // Use a ref to ensure this only runs once per navigation to /editor/new
  const hasResetRef = useRef(false);
  
  useEffect(() => {
    if (!hasResetRef.current) {
      hasResetRef.current = true;
      setMarkdown("");
      setDocumentId(null);
      setTitleDocumentId(null);
      setDocumentTitle("Untitled");
    }
    
    // Reset the flag when component unmounts so next visit works
    return () => {
      hasResetRef.current = false;
    };
  }, [setMarkdown, setDocumentId, setTitleDocumentId, setDocumentTitle]);

  return <Workspace />;
}
