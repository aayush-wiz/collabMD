"use client";

import { EditorNavbar } from "../../components/editor/editor-navbar";
import { useTheme } from "../../providers/theme-provider";
import { EditorProvider } from "../../components/editor/editor-context";
import { DocumentTitleProvider } from "../../components/editor/document-title-context";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  
  return (
    <DocumentTitleProvider>
      <EditorProvider>
        <EditorNavbar />
        <main 
          className="flex flex-1 flex-col overflow-hidden"
          style={{
            backgroundColor: theme === "dark" ? "#111111" : "#FAFAFA",
          }}
        >
          {children}
        </main>
      </EditorProvider>
    </DocumentTitleProvider>
  );
}

