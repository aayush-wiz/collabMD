"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useEditorContext } from "./editor-context";
import { createMarkdownComponents } from "./markdown-components";
import { useTheme } from "../../providers/theme-provider";

export function PreviewPane() {
  const { markdown } = useEditorContext();
  const { theme } = useTheme();

  const markdownComponents = useMemo(() => createMarkdownComponents(theme), [theme]);

  const colors = theme === "dark"
    ? { surface: "#1A1A1A", border: "#2C2C2C" }
    : { surface: "#FFFFFF", border: "#DCDCDC" };

  return (
    <section 
      className="flex h-full flex-1 flex-col border shadow-lg"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      
      <div className="flex-1 overflow-auto px-6 py-5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </section>
  );
}
