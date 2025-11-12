"use client";

import type { Components } from "react-markdown";
import { cn } from "../../lib/utils";

export const markdownComponents: Components = {
  h1: ({ className, ...props }) => (
    <h1
      {...props}
      className={cn("mt-0 text-3xl font-semibold text-white", className)}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      {...props}
      className={cn(
        "mt-10 text-2xl font-semibold text-white first:mt-0",
        className,
      )}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      {...props}
      className={cn("mt-8 text-xl font-semibold text-white", className)}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      {...props}
      className={cn("mt-4 leading-7 text-slate-300 first:mt-0", className)}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      {...props}
      className={cn(
        "mt-4 list-disc space-y-2 pl-6 text-slate-300 marker:text-cyan-300",
        className,
      )}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      {...props}
      className={cn(
        "mt-4 list-decimal space-y-2 pl-6 text-slate-300 marker:text-cyan-300",
        className,
      )}
    />
  ),
  li: ({ className, ...props }) => (
    <li {...props} className={cn("leading-6", className)} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      {...props}
      className={cn(
        "mt-6 border-l-4 border-cyan-400/60 bg-slate-900/60 px-4 py-3 text-slate-200 shadow-inner shadow-cyan-400/10",
        className,
      )}
    />
  ),
  code: ({ inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code
          {...props}
          className={cn(
            "rounded-md bg-slate-950/70 px-1.5 py-0.5 font-mono text-sm text-cyan-200",
            className,
          )}
        >
          {children}
        </code>
      );
    }

    return (
      <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950/60 p-4 shadow-inner shadow-slate-900/40">
        <code
          {...props}
          className={cn(
            "block font-mono text-sm leading-6 text-cyan-200",
            className,
          )}
        >
          {children}
        </code>
      </pre>
    );
  },
  a: ({ className, ...props }) => (
    <a
      {...props}
      className={cn(
        "font-medium text-cyan-300 underline decoration-cyan-500/60 underline-offset-4 transition hover:text-cyan-200",
        className,
      )}
      target="_blank"
      rel="noreferrer"
    />
  ),
  table: ({ className, ...props }) => (
    <div className="mt-6 overflow-x-auto">
      <table
        {...props}
        className={cn(
          "w-full border-separate border-spacing-0 rounded-2xl text-sm text-slate-200",
          className,
        )}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      {...props}
      className={cn(
        "bg-slate-900/80 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-200",
        className,
      )}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      {...props}
      className={cn(
        "border-t border-slate-800/80 bg-slate-900/40 px-4 py-3 text-sm text-slate-300",
        className,
      )}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      {...props}
      className={cn(
        "my-6 border-t border-dashed border-slate-800",
        className,
      )}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong
      {...props}
      className={cn("font-semibold text-white", className)}
    />
  ),
};

