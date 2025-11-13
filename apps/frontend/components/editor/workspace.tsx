"use client";

import { useEditorContext } from "./editor-context";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import { cn } from "../../lib/utils";

export function Workspace() {
  const { viewMode } = useEditorContext();

  const showEditor = viewMode === "split" || viewMode === "editor";
  const showPreview = viewMode === "split" || viewMode === "preview";

  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col",
        showEditor &&
          showPreview &&
          "lg:flex-row lg:[&>*]:basis-1/2 lg:[&>*]:min-w-0 lg:[&>*]:grow"
      )}
    >
      {showEditor && <EditorPane />}
      {showPreview && <PreviewPane />}
    </div>
  );
}
