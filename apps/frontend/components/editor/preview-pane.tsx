"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useEditorContext } from "./editor-context";
import { markdownComponents } from "./markdown-components";

export function PreviewPane() {
  const { markdown } = useEditorContext();

  return (
    <section className="flex h-full flex-1 flex-col border border-slate-800 bg-slate-900/60 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.95)]">
      
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
