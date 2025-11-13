"use client";

import { useEffect } from "react";
import { Workspace } from "../../../components/editor/workspace";
import {
  useEditorContext,
  DEFAULT_MARKDOWN,
} from "../../../components/editor/editor-context";

export default function NewEditorPage() {
  const { setMarkdown, setDocumentId } = useEditorContext();

  useEffect(() => {
    // Reset to default markdown for new document
    setMarkdown(DEFAULT_MARKDOWN);
    setDocumentId(null);
  }, [setMarkdown, setDocumentId]);

  return <Workspace />;
}
