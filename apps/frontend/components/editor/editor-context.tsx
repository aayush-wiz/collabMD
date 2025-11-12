"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type ViewMode = "split" | "preview" | "editor";

interface EditorContextValue {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const VIEW_MODES: { key: ViewMode; label: string; src: string }[] = [
  { key: "split", label: "Split Pane", src: "/icons/navbar/split-view.svg" },
  { key: "preview", label: "Preview Only", src: "/icons/navbar/markdown-view.svg" },
  { key: "editor", label: "Editor Only", src: "/icons/navbar/edit-view.svg" },
];

export const DEFAULT_MARKDOWN = `# Product Roadmap

> 💡 This template helps your team plan quarterly goals and stay aligned.

## ✅ Product Description

Describe the product you want to create a roadmap for. Capture the problem it solves, who it serves, and how success will be measured.

## 📆 Quarterly Roadmap

| Goals Description | Q1 | Q2 | Q3 | Q4 |
| ----------------- | --- | --- | --- | --- |
| Theme | Product Ideation | Concept | Testing | Release |
| Host | Lucy | Mark | Lucy | Amy |
| Priority | High | Medium | High | Low |

### Q1

- [x] Product ideation
- [ ] Related product research
- [ ] Kick-off design sprint

> ✅ Tip: Check off items as each milestone ships.

### Q2

1. Concept validation interviews
2. Prototype usability studies
3. Align launch metrics

### Notes

- Communicate updates every Friday in Slack.
- Track decisions inside the shared Notion doc.
- Highlight blockers early to unblock the team.

\`\`\`ts
const releaseDate = "2025-01-15";
const team = ["Lucy", "Mark", "Amy", "Brittany"];
\`\`\`
`;

export function EditorProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  const value = useMemo<EditorContextValue>(
    () => ({
      markdown,
      setMarkdown,
      viewMode,
      setViewMode,
    }),
    [markdown, viewMode]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
}
