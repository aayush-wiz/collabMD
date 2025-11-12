"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useEditorContext } from "./editor-context";
import { markdownComponents } from "./markdown-components";

export function PreviewPane() {
  const { markdown } = useEditorContext();

  return (
    <section className="flex flex-1 flex-col overflow-hidden border border-slate-800 bg-slate-900/60 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.95)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Preview</h2>
          <p className="text-xs text-slate-400">
            Rendered output with GitHub-flavored markdown.
          </p>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          Preview
        </span>
      </div>
      <div className="flex-1 overflow-auto px-6 py-5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </section>
  );
}
