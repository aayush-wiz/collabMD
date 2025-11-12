"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { markdown as markdownExtension } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

import { useEditorContext } from "./editor-context";
import { EditorToolbar } from "./editor-toolbar";

const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror").then((mod) => mod.default),
  { ssr: false }
);

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "#E2E8F0",
      fontFamily:
        '"JetBrains Mono", "Fira Code", "SFMono-Regular", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: "14px",
    },
    ".cm-editor": {
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#38BDF8",
      paddingBottom: "96px",
    },
    ".cm-line": {
      paddingLeft: "0",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(148, 163, 184, 0.08)",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(56, 189, 248, 0.25)",
    },
    ".cm-gutters": {
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      borderRight: "1px solid rgba(148, 163, 184, 0.2)",
    },
    ".cm-lineNumbers": {
      minWidth: "3.25rem",
      paddingRight: "1rem",
      color: "#94A3B8",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(148, 163, 184, 0.18)",
      color: "#E2E8F0",
    },
    ".cm-scroller": {
      padding: "1.5rem",
    },
    ".cm-foldGutter": {
      display: "none",
    },
  },
  { dark: true }
);

export function EditorPane() {
  const { markdown, setMarkdown } = useEditorContext();

  const extensions = useMemo(
    () => [markdownExtension(), EditorView.lineWrapping],
    []
  );

  const handleChange = useCallback(
    (value: string) => {
      setMarkdown(value);
    },
    [setMarkdown]
  );

  return (
    <section className="flex flex-1 flex-col overflow-hidden border border-slate-800 bg-slate-900/60 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.95)]">
      <div className="border-b border-slate-800">
        <EditorToolbar />
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={markdown}
          height="100%"
          extensions={extensions}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: false,
            autocompletion: false,
            bracketMatching: true,
          }}
          onChange={handleChange}
          theme={editorTheme}
        />
      </div>
    </section>
  );
}
