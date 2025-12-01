"use client";

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { EditorView } from "@codemirror/view";
import { undo, redo } from "@codemirror/commands";
import { documentApi } from "../../lib/api-client";
import { useDocumentTitle } from "./document-title-context";

export type ViewMode = "split" | "preview" | "editor";

interface EditorContextValue {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  editorViewRef: { current: EditorView | null };
  executeAction: (actionId: string) => void;
  executeActionWithColor: (actionId: string, color: string) => void;
  insertHeading: (level: number) => void;
  documentId: string | null;
  setDocumentId: Dispatch<SetStateAction<string | null>>;
  documentTitle: string | null;
  saveDocument: () => Promise<void>;
  isSaving: boolean;
  pendingSave: boolean;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const VIEW_MODES: { key: ViewMode; label: string; src: string }[] = [
  { key: "split", label: "Split Pane", src: "/icons/navbar/split-view.svg" },
  {
    key: "preview",
    label: "Preview Only",
    src: "/icons/navbar/markdown-view.svg",
  },
  { key: "editor", label: "Editor Only", src: "/icons/navbar/edit-view.svg" },
];

export const DEFAULT_MARKDOWN = `# Product Roadmap

>  This template helps your team plan quarterly goals and stay aligned.

##  Product Description

Describe the product you want to create a roadmap for. Capture the problem it solves, who it serves, and how success will be measured.

##  Quarterly Roadmap

| Goals Description | Q1 | Q2 | Q3 | Q4 |
| ----------------- | --- | --- | --- | --- |
| Theme | Product Ideation | Concept | Testing | Release |
| Host | Lucy | Mark | Lucy | Amy |
| Priority | High | Medium | High | Low |

### Q1

- [x] Product ideation
- [ ] Related product research
- [ ] Kick-off design sprint

>  Tip: Check off items as each milestone ships.

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
  const [markdown, setMarkdown] = useState("");
  const [documentId, setDocumentIdState] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const editorViewRef = useRef<EditorView | null>(null);
  
  // Integrate with DocumentTitleProvider
  const { documentTitle, setDocumentId: setTitleDocumentId, setDocumentTitle } = useDocumentTitle();
  
  // Sync documentId with DocumentTitleProvider
  const setDocumentId = useCallback((id: SetStateAction<string | null>) => {
    const newId = typeof id === 'function' ? id(documentId) : id;
    setDocumentIdState(newId);
    setTitleDocumentId(newId);
  }, [setTitleDocumentId, documentId]);

  const insertHeading = useCallback((level: number) => {
    const view = editorViewRef.current;
    if (!view) return;

    const hashes = "#".repeat(level);
    insertAtLineStart(view, `${hashes} `);
  }, []);

  const isSavingRef = useRef(false);
  const createdDocIdRef = useRef<string | null>(null);

  const saveDocument = useCallback(async () => {
    if (isSavingRef.current) return;

    // Check if user is authenticated before attempting to save
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return;
    }

    const currentDocId = documentId || createdDocIdRef.current;
    const trimmed = markdown.trim();

    // If there's no content at all and no document exists, don't create
    if (!trimmed && !currentDocId) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);
    
    try {
      if (!currentDocId) {
        // Create new document only if we haven't created one already
        const created = await documentApi.create({
          title: documentTitle || "Untitled",
          content: markdown,
        });

        if (created?.id) {
          createdDocIdRef.current = created.id;
          setDocumentId(created.id);
          if (created?.title) {
            setDocumentTitle(created.title);
          }
        }
      } else {
        // Update existing document
        await documentApi.update(currentDocId, { content: markdown });
      }
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [documentId, markdown, documentTitle, setDocumentTitle, setDocumentId]);

  const executeActionWithColor = useCallback((actionId: string, color: string) => {
    const view = editorViewRef.current;
    if (!view) return;

    const state = view.state;
    const selection = state.selection.main;
    const selectedText = state.doc.sliceString(selection.from, selection.to);

    switch (actionId) {
      case "highlight":
        wrapText(
          view,
          `<mark style="background-color: ${color};">`,
          "</mark>",
          selectedText
        );
        break;
      case "quote":
        insertColoredQuote(view, color);
        break;
    }
  }, []);

  const executeAction = useCallback((actionId: string) => {
    const view = editorViewRef.current;
    if (!view) return;

    const state = view.state;
    const selection = state.selection.main;
    const selectedText = state.doc.sliceString(selection.from, selection.to);

    switch (actionId) {
      case "undo":
        undo(view);
        break;
      case "redo":
        redo(view);
        break;
      case "bold":
        wrapText(view, "**", "**", selectedText);
        break;
      case "italic":
        wrapText(view, "*", "*", selectedText);
        break;
      case "strikethrough":
        wrapText(view, "~~", "~~", selectedText);
        break;
      case "code":
        if (selectedText.includes("\n")) {
          wrapText(view, "```\n", "\n```", selectedText);
        } else {
          wrapText(view, "`", "`", selectedText);
        }
        break;
      case "bullet":
        insertAtLineStart(view, "- ");
        break;
      case "numbered":
        insertAtLineStart(view, "1. ");
        break;
      case "checkbox":
        view.dispatch({
          changes: { from: selection.from, insert: "- [ ] " },
          selection: { anchor: selection.from + 6 },
        });
        view.focus();
        break;
      case "link":
        insertLink(view, selectedText);
        break;
      case "subscript":
        wrapText(view, "<sub>", "</sub>", selectedText);
        break;
      case "table":
        insertTable(view);
        break;
      case "divider":
        view.dispatch({
          changes: { from: selection.from, insert: "---\n" },
          selection: { anchor: selection.from + 4 },
        });
        view.focus();
        break;
    }
  }, []);

  const value = useMemo<EditorContextValue>(
    () => ({
      markdown,
      setMarkdown,
      viewMode,
      setViewMode,
      editorViewRef,
      executeAction,
      executeActionWithColor,
      insertHeading,
      documentId,
      setDocumentId,
      documentTitle,
      saveDocument,
      isSaving,
      pendingSave,
    }),
    [
      markdown,
      viewMode,
      documentId,
      documentTitle,
      isSaving,
      pendingSave,
      saveDocument,
      setDocumentId,
      executeAction,
      executeActionWithColor,
      insertHeading,
      editorViewRef
    ]
  );

  // Debounced autosave when markdown changes.
  // Creates a document the first time there is non-empty content,
  // then updates it on subsequent edits.
  useEffect(() => {
    const currentDocId = documentId || createdDocIdRef.current;
    const trimmed = markdown.trim();

    if (!currentDocId && !trimmed) {
      // Nothing to save or create yet
      setPendingSave(false);
      return;
    }

    setPendingSave(true);

    // When creating a brand-new document, run the save a bit sooner so UX feels snappy.
    const delay = currentDocId ? 800 : 400;

    const timer = setTimeout(async () => {
      await saveDocument();
      setPendingSave(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [markdown, documentId, saveDocument]);

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

function wrapText(
  view: EditorView,
  prefix: string,
  suffix: string,
  selectedText: string
) {
  const selection = view.state.selection.main;
  const insert = selectedText
    ? `${prefix}${selectedText}${suffix}`
    : `${prefix}${suffix}`;
  const cursorOffset = selectedText
    ? prefix.length + selectedText.length + suffix.length
    : prefix.length;

  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert },
    selection: { anchor: selection.from + cursorOffset },
  });
  view.focus();
}

function insertAtLineStart(view: EditorView, prefix: string) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);
  const lineStart = line.from;

  view.dispatch({
    changes: { from: lineStart, insert: prefix },
    selection: { anchor: selection.from + prefix.length },
  });
  view.focus();
}

function insertTable(view: EditorView) {
  const selection = view.state.selection.main;
  const table = `| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

  view.dispatch({
    changes: { from: selection.from, insert: table },
    selection: { anchor: selection.from + table.length },
  });
  view.focus();
}

function insertColoredQuote(view: EditorView, color: string) {
  const selection = view.state.selection.main;
  const line = view.state.doc.lineAt(selection.from);
  const lineStart = line.from;
  const lineText = line.text;

  // Check if line already starts with a blockquote marker
  const quoteMatch = lineText.match(/^>\s*/);
  if (quoteMatch) {
    // Already a quote, wrap it in a colored div
    const quoteText = lineText.slice(quoteMatch[0].length);
    const coloredQuote = `<blockquote style="border-color: ${color};">\n${quoteText}\n</blockquote>\n`;
    view.dispatch({
      changes: { from: lineStart, to: line.to, insert: coloredQuote },
      selection: { anchor: lineStart + coloredQuote.length },
    });
  } else {
    // Not a quote yet, create a colored blockquote
    const coloredQuote = `<blockquote style="border-color: ${color};">\n${lineText || "Quote text"}\n</blockquote>\n`;
    view.dispatch({
      changes: { from: lineStart, to: line.to, insert: coloredQuote },
      selection: { anchor: lineStart + coloredQuote.length },
    });
  }
  view.focus();
}

function insertLink(view: EditorView, selectedText: string) {
  const selection = view.state.selection.main;
  const linkText = selectedText || "link text";
  const template = `[${linkText}](url)`;
  const urlStart = selection.from + linkText.length + 3; // Position after "]("
  const urlEnd = urlStart + 3; // Length of "url"

  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert: template },
    selection: { anchor: urlStart, head: urlEnd }, // Select "url" text
  });
  view.focus();
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
}
