"use client";

import { useEffect } from "react";
import { Workspace } from "../../../components/editor/workspace";
import { useEditorContext } from "../../../components/editor/editor-context";

export default function NewEditorPage() {
  const { setMarkdown, setDocumentId } = useEditorContext();

  useEffect(() => {
    // Start with empty content for a brand new document
    setMarkdown("");
    setDocumentId(null);
  }, [setMarkdown, setDocumentId]);

  return <Workspace />;
}
