"use client";

import type { Components } from "react-markdown";
import { cn } from "../../lib/utils";

export const createMarkdownComponents = (theme: "light" | "dark"): Components => {
  const colors = theme === "dark"
    ? { text: "#F2F2F2", textSub: "#A6A6A6", surface: "#1A1A1A", border: "#2C2C2C", accent: "#4DA6FF" }
    : { text: "#111111", textSub: "#5A5A5A", surface: "#FFFFFF", border: "#DCDCDC", accent: "#007ACC" };

  return {
    h1: ({ className, ...props }) => (
      <h1
        {...props}
        className={cn("mt-0 text-3xl font-semibold", className)}
        style={{ color: colors.text }}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        {...props}
        className={cn("mt-10 text-2xl font-semibold first:mt-0", className)}
        style={{ color: colors.text }}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        {...props}
        className={cn("mt-8 text-xl font-semibold", className)}
        style={{ color: colors.text }}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        {...props}
        className={cn("mt-4 leading-7 first:mt-0", className)}
        style={{ color: colors.textSub }}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        {...props}
        className={cn("mt-4 list-disc space-y-2 pl-6", className)}
        style={{ color: colors.textSub }}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        {...props}
        className={cn("mt-4 list-decimal space-y-2 pl-6", className)}
        style={{ color: colors.textSub }}
      />
    ),
    li: ({ className, ...props }) => (
      <li {...props} className={cn("leading-6", className)} />
    ),
    blockquote: ({ className, style, ...props }) => (
      <blockquote
        {...props}
        style={{ 
          ...style, 
          borderLeftColor: colors.accent, 
          backgroundColor: theme === "dark" ? "rgba(26, 26, 26, 0.6)" : "rgba(0, 122, 204, 0.05)",
          color: colors.text,
        }}
        className={cn("mt-6 border-l-4 px-4 py-3 shadow-inner", className)}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        {...props}
        className={cn("mt-6 overflow-x-auto rounded-2xl p-4 shadow-inner", className)}
        style={{
          backgroundColor: theme === "dark" ? "#0D0D0D" : "#F5F5F5",
          color: colors.text,
        }}
      />
    ),
    code: ({ className, ...props }) => {
      const isInline = !className?.includes("language-");
      return (
        <code
          {...props}
          className={cn(
            isInline
              ? "rounded-md px-1.5 py-0.5 font-mono text-sm"
              : "block font-mono text-sm leading-6",
            className
          )}
          style={{
            backgroundColor: isInline 
              ? (theme === "dark" ? "#2C2C2C" : "#E8E8E8")
              : "transparent",
            color: colors.accent,
          }}
        />
      );
    },
    a: ({ className, ...props }) => (
      <a
        {...props}
        className={cn("font-medium underline underline-offset-4 transition", className)}
        style={{ color: colors.accent }}
        target="_blank"
        rel="noreferrer"
      />
    ),
    img: ({ src, alt, className, ...props }) => {
      const srcString = typeof src === "string" ? src : "";
      if (!src || srcString === "" || srcString === "url" || srcString.trim() === "") {
        return (
          <span
            className={cn("inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm italic border mt-2", className)}
            style={{
              backgroundColor: colors.surface,
              color: colors.textSub,
              borderColor: colors.border,
            }}
          >
            🖼️ [Image placeholder: {alt || "Paste your image URL"}]
          </span>
        );
      }

      return (
        <img
          {...props}
          src={srcString}
          alt={alt || ""}
          className={cn("max-w-full h-auto rounded-lg shadow-lg my-4 block", className)}
          onError={(e) => {
            const target = e.currentTarget;
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".error-message")) {
              target.style.display = "none";
              const errorMsg = document.createElement("span");
              errorMsg.className =
                "error-message inline-flex flex-col gap-1 px-3 py-2 rounded-md bg-red-900/20 text-red-300 text-sm border border-red-700/50 my-2";
              errorMsg.innerHTML = `<span class="flex items-center gap-2"><span>⚠️</span><span>Failed to load image</span></span><span class="text-xs text-red-400/70 break-all">${srcString}</span>`;
              parent.appendChild(errorMsg);
            }
          }}
          loading="lazy"
        />
      );
    },
    table: ({ className, ...props }) => (
      <div className="mt-6 overflow-x-auto">
        <table
          {...props}
          className={cn("w-full border-separate border-spacing-0 rounded-2xl text-sm", className)}
          style={{ color: colors.text }}
        />
      </div>
    ),
    th: ({ className, ...props }) => (
      <th
        {...props}
        className={cn("px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide", className)}
        style={{
          backgroundColor: colors.surface,
          color: colors.text,
        }}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        {...props}
        className={cn("border-t px-4 py-3 text-sm", className)}
        style={{
          borderColor: colors.border,
          backgroundColor: theme === "dark" ? "rgba(26, 26, 26, 0.4)" : "rgba(250, 250, 250, 0.4)",
          color: colors.textSub,
        }}
      />
    ),
    hr: ({ className, ...props }) => (
      <hr
        {...props}
        className={cn("my-6 border-t border-dashed", className)}
        style={{ borderColor: colors.border }}
      />
    ),
    strong: ({ className, ...props }) => (
      <strong
        {...props}
        className={cn("font-semibold", className)}
        style={{ color: colors.text }}
      />
    ),
    mark: ({ className, style, ...props }) => (
      <mark
        {...props}
        style={style}
        className={cn("px-1 rounded font-medium", className)}
      />
    ),
    sub: ({ className, ...props }) => (
      <sub
        {...props}
        className={cn("text-xs", className)}
        style={{ color: colors.textSub }}
      />
    ),
  };
};
