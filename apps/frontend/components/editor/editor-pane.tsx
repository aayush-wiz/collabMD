"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { markdown as markdownExtension } from "@codemirror/lang-markdown";
import {
  EditorView,
  ViewUpdate,
  Decoration,
  WidgetType,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

import { useEditorContext } from "./editor-context";
import { EditorToolbar } from "./editor-toolbar";
import { useTheme } from "../../providers/theme-provider";
import {
  sendDocumentChange,
  sendCursorMove,
  getClientId,
} from "../../lib/realtime";

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
  const { markdown, setMarkdown, editorViewRef, documentId, remoteCursors } =
    useEditorContext();
  const { theme } = useTheme();

  const debouncedEmitRef = useRef<((value: string) => void) | null>(null);

  // Debounced emitter for document changes
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    debouncedEmitRef.current = (value: string) => {
      if (!documentId) return;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        sendDocumentChange({
          documentId,
          content: value,
        });
      }, 150);
    };

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [documentId]);

  const cursorSyncExtension = useMemo(
    () =>
      EditorView.updateListener.of((update: ViewUpdate) => {
        if (!update.selectionSet) return;
        if (!documentId) return;

        const selection = update.state.selection.main;
        const userId = getClientId();

        sendCursorMove({
          documentId,
          userId,
          from: selection.from,
          to: selection.to,
        });
      }),
    [documentId]
  );

  const remoteCursorExtension = useMemo(
    () => createRemoteCursorExtension(remoteCursors),
    [remoteCursors]
  );

  const extensions = useMemo(
    () => [
      markdownExtension(),
      EditorView.lineWrapping,
      cursorSyncExtension,
      remoteCursorExtension,
    ],
    [cursorSyncExtension, remoteCursorExtension]
  );

  const editorTheme = useMemo(
    () => (theme === "dark" ? darkEditorTheme : lightEditorTheme),
    [theme]
  );

  const colors =
    theme === "dark"
      ? { surface: "#1A1A1A", border: "#2C2C2C" }
      : { surface: "#FFFFFF", border: "#DCDCDC" };

  const handleChange = useCallback(
    (value: string) => {
      setMarkdown(value);
      debouncedEmitRef.current?.(value);
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
      <div className="border-b" style={{ borderColor: colors.border }}>
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

function createRemoteCursorExtension(
  remoteCursors: Record<string, { from: number; to: number }>
) {
  return EditorView.decorations.of((view) => {
    const builder = new RangeSetBuilder<Decoration>();

    const docLength = view.state.doc.length;

    Object.entries(remoteCursors).forEach(([, range], index) => {
      const from = Math.max(0, Math.min(range.from, docLength));
      const to = Math.max(0, Math.min(range.to, docLength));

      if (from > docLength) return;

      const hue = (index * 57) % 360;
      const color = `hsl(${hue} 100% 50%)`;

      if (from === to) {
        const cursorDeco = Decoration.widget({
          widget: new RemoteCursorWidget(color),
          side: 1,
        });
        builder.add(from, from, cursorDeco);
      } else {
        const mark = Decoration.mark({
          attributes: {
            style: `background-color: ${color}33;`,
          },
        });
        builder.add(from, to, mark);
      }
    });

    return builder.finish();
  });
}

class RemoteCursorWidget extends WidgetType {
  private readonly color: string;

  constructor(color: string) {
    super();
    this.color = color;
  }

  eq(other: WidgetType): boolean {
    return other instanceof RemoteCursorWidget && other.color === this.color;
  }

  toDOM(): HTMLSpanElement {
    const span = document.createElement("span");
    span.style.borderLeft = `2px solid ${this.color}`;
    span.style.marginLeft = "-1px";
    span.style.marginRight = "-1px";
    span.style.height = "1em";
    span.style.display = "inline-block";
    span.style.verticalAlign = "text-bottom";
    return span;
  }
}
