"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { markdown as markdownExtension } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

import { useEditorContext } from "./editor-context";
import { EditorToolbar } from "./editor-toolbar";
import { useTheme } from "../../providers/theme-provider";

const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror").then((mod) => mod.default),
  { ssr: false }
);

const darkEditorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "#F2F2F2",
      fontFamily:
        '"JetBrains Mono", "Fira Code", "SFMono-Regular", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: "14px",
    },
    ".cm-editor": {
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#4DA6FF",
      paddingBottom: "96px",
    },
    ".cm-line": {
      paddingLeft: "0",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(77, 166, 255, 0.1)",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(77, 166, 255, 0.2)",
    },
    ".cm-gutters": {
      backgroundColor: "#1A1A1A",
      borderRight: "1px solid #2C2C2C",
    },
    ".cm-lineNumbers": {
      minWidth: "3.25rem",
      paddingRight: "1rem",
      color: "#A6A6A6",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(77, 166, 255, 0.15)",
      color: "#F2F2F2",
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

const lightEditorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "#111111",
      fontFamily:
        '"JetBrains Mono", "Fira Code", "SFMono-Regular", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: "14px",
    },
    ".cm-editor": {
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#007ACC",
      paddingBottom: "96px",
    },
    ".cm-line": {
      paddingLeft: "0",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(0, 122, 204, 0.08)",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(0, 122, 204, 0.15)",
    },
    ".cm-gutters": {
      backgroundColor: "#FFFFFF",
      borderRight: "1px solid #DCDCDC",
    },
    ".cm-lineNumbers": {
      minWidth: "3.25rem",
      paddingRight: "1rem",
      color: "#5A5A5A",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(0, 122, 204, 0.12)",
      color: "#111111",
    },
    ".cm-scroller": {
      padding: "1.5rem",
    },
    ".cm-foldGutter": {
      display: "none",
    },
  },
  { dark: false }
);

export function EditorPane() {
  const { markdown, setMarkdown, editorViewRef } = useEditorContext();
  const { theme } = useTheme();

  const extensions = useMemo(
    () => [markdownExtension(), EditorView.lineWrapping],
    []
  );

  const editorTheme = useMemo(
    () => (theme === "dark" ? darkEditorTheme : lightEditorTheme),
    [theme]
  );

  const colors = theme === "dark"
    ? { surface: "#1A1A1A", border: "#2C2C2C" }
    : { surface: "#FFFFFF", border: "#DCDCDC" };

  const handleChange = useCallback(
    (value: string) => {
      setMarkdown(value);
    },
    [setMarkdown]
  );

  const onCreateEditor = useCallback(
    (view: EditorView) => {
      editorViewRef.current = view;
    },
    [editorViewRef]
  );

  return (
    <section 
      className="flex h-full flex-1 flex-col border shadow-lg"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <div 
        className="border-b"
        style={{ borderColor: colors.border }}
      >
        <EditorToolbar />
      </div>
      <div className="flex-1 overflow-y-auto">
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
          onCreateEditor={onCreateEditor}
          theme={editorTheme}
        />
      </div>
    </section>
  );
}
