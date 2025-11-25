"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { VIEW_MODES, useEditorContext } from "./editor-context";
import { cn } from "../../lib/utils";
import { Tooltip } from "../ui/tooltip";
import { useTheme } from "../../providers/theme-provider";
import { DownloadModal } from "./download-modal";
import { localDocs, summarize, setTitle as setContentTitle } from "../../lib/local-docs";

export function EditorNavbar() {
  const {
    viewMode,
    setViewMode,
    isSaving,
    markdown,
    documentId,
    setMarkdown,
    pendingSave,
    remoteCursors,
  } = useEditorContext();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(() => summarize(markdown).title);

  const isEditorRoute = pathname?.startsWith("/editor");

  const collaboratorCount = useMemo(() => Object.keys(remoteCursors).length, [
    remoteCursors,
  ]);

  const colors =
    theme === "dark"
      ? {
          bg: "#1A1A1A",
          text: "#F2F2F2",
          textSub: "#A6A6A6",
          border: "#2C2C2C",
          accent: "#4DA6FF",
        }
      : {
          bg: "#FFFFFF",
          text: "#111111",
          textSub: "#5A5A5A",
          border: "#DCDCDC",
          accent: "#007ACC",
        };

  return (
    <header
      className="w-full border-b shadow-lg h-14"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {/* grid layout: auto (left) | 1fr (center) | auto (right) */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center h-full px-4">
        {/* LEFT: real interactive controls */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: colors.accent }}
          >
            COLLABMD
          </span>

          <div
            className="flex items-center gap-1 rounded-lg p-1 backdrop-blur-[2px]"
            style={{
              backgroundColor: theme === "dark" ? "#2C2C2C" : "#F5F5F5",
            }}
          >
            {VIEW_MODES.map(({ key, label, src }, index) => {
              const isActive = viewMode === key;
              return (
                <Tooltip
                  key={key}
                  content={label}
                  delayDuration={index * 75}
                  side="bottom"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode(key)}
                    aria-pressed={isActive}
                    aria-label={label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                    style={{
                      backgroundColor: isActive ? colors.accent : "transparent",
                      color: isActive ? "#FFFFFF" : colors.textSub,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor =
                          theme === "dark" ? "#333333" : "#E8E8E8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Image
                      src={src}
                      alt={label}
                      width={16}
                      height={16}
                      style={{
                        filter: theme === "light" ? "invert(1)" : "none",
                      }}
                    />
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {isEditorRoute && (
            <span
              className="text-sm font-medium"
              style={{ color: colors.textSub }}
              aria-live="polite"
            >
              {pendingSave || isSaving ? "Saving..." : "Auto-saved"}
            </span>
          )}
        </div>

        {/* CENTER: flexible, naturally centered by grid */}
        <div className="flex justify-center">
          <div
            className="backdrop-blur-sm rounded-md border px-3 py-1.5 text-sm font-medium max-w-[60vw]"
            style={{
              lineHeight: 1.5,
              backgroundColor:
                theme === "dark"
                  ? "rgba(26, 26, 26, 0.4)"
                  : "rgba(250, 250, 250, 0.6)",
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === "Escape") {
                  // Revert to current derived title
                  setTitleInput(summarize(markdown).title);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              onBlur={() => {
                const next = titleInput.trim();
                const current = summarize(markdown).title;
                if (!next || next === current) {
                  setTitleInput(current);
                  return;
                }
                if (documentId) {
                  const updated = localDocs.rename(documentId, next);
                  setMarkdown(updated.content);
                } else {
                  const updatedContent = setContentTitle(markdown, next);
                  setMarkdown(updatedContent);
                }
              }}
              aria-label="Rename document"
              className="bg-transparent outline-none text-center w-[52vw] sm:w-[56vw] lg:w-[40vw] text-sm font-semibold tracking-tight placeholder:text-[#999] truncate"
              style={{
                color: colors.text,
              }}
              placeholder="Untitled"
              spellCheck={false}
            />
          </div>
        </div>

        {/* RIGHT: mirrored placeholders (same visual slots as left) so center uses flex/grid centering */}
        <div className="flex items-center gap-3 justify-end">
          {/* collaborator presence */}
          <div className="flex items-center gap-2 rounded-lg px-2 py-1">
            <span
              className="inline-flex h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  collaboratorCount > 1 ? colors.accent : colors.textSub,
              }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-medium"
              style={{ color: colors.textSub }}
            >
              {collaboratorCount === 0
                ? "Just you here"
                : collaboratorCount === 1
                ? "1 collaborator"
                : `${collaboratorCount} collaborators`}
            </span>
          </div>
          {/* placeholder group that mirrors view-mode buttons count */}
          <div className="flex items-center gap-1 rounded-lg p-1">
            <Tooltip
              content={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              delayDuration={150}
              side="bottom"
            >
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-md transition"
                style={{
                  backgroundColor: theme === "dark" ? "#2C2C2C" : "#F5F5F5",
                  color: colors.textSub,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === "dark" ? "#333333" : "#E8E8E8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === "dark" ? "#2C2C2C" : "#F5F5F5";
                }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <Image
                  src={`/icons/navbar/${theme === "dark" ? "light-theme" : "dark-theme"}.svg`}
                  alt={`${theme === "dark" ? "Light" : "Dark"} theme`}
                  width={16}
                  height={16}
                  style={{ filter: theme === "light" ? "invert(1)" : "none" }}
                />
              </button>
            </Tooltip>
            <Tooltip content="Workspace" delayDuration={225} side="bottom">
              <button
                type="button"
                onClick={() => router.push("/workspace")}
                className="flex h-9 w-9 items-center justify-center rounded-md transition"
                style={{
                  backgroundColor: theme === "dark" ? "#2C2C2C" : "#F5F5F5",
                  color: colors.textSub,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === "dark" ? "#333333" : "#E8E8E8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === "dark" ? "#2C2C2C" : "#F5F5F5";
                }}
                aria-label="Open Workspace"
              >
                <Image
                  src="/icons/navbar/home.svg"
                  alt="Workspace"
                  width={16}
                  height={16}
                  style={{ filter: theme === "light" ? "invert(1)" : "none" }}
                />
              </button>
            </Tooltip>
          </div>

          <Tooltip content="Download" delayDuration={300} side="bottom">
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md transition"
              style={{
                backgroundColor: theme === "dark" ? "#2C2C2C" : "#F5F5F5",
                color: colors.textSub,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "#333333" : "#E8E8E8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "#2C2C2C" : "#F5F5F5";
              }}
              aria-label="Download Document"
            >
              <Image
                src="/icons/navbar/download.svg"
                alt="Download"
                width={16}
                height={16}
                style={{ filter: theme === "light" ? "invert(1)" : "none" }}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        markdown={markdown}
        documentId={documentId}
      />
    </header>
  );
}
