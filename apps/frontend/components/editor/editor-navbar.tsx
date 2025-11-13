"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { VIEW_MODES, useEditorContext } from "./editor-context";
import { cn } from "../../lib/utils";
import { Tooltip } from "../ui/tooltip";
import { useTheme } from "../../providers/theme-provider";
import { DownloadModal } from "./download-modal";

export function EditorNavbar() {
  const { viewMode, setViewMode, saveDocument, isSaving, markdown, documentId } = useEditorContext();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const isEditorRoute = pathname?.startsWith("/editor");

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
            <Tooltip content="Save document" delayDuration={225} side="bottom">
              <button
                type="button"
                onClick={saveDocument}
                disabled={isSaving}
                className={cn(
                  "flex h-9 px-3 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white"
                )}
                style={{
                  backgroundColor: isSaving
                    ? theme === "dark"
                      ? "#2C2C2C"
                      : "#DCDCDC"
                    : colors.accent,
                  color: isSaving ? colors.textSub : "#FFFFFF",
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
                aria-label="Save document"
              >
                <span className="text-sm font-medium">
                  {isSaving ? "Saving..." : "Save"}
                </span>
              </button>
            </Tooltip>
          )}
        </div>

        {/* CENTER: flexible, naturally centered by grid */}
        <div className="flex justify-center">
          <div
            className="select-none backdrop-blur-sm rounded-md border px-4 py-1.5 text-sm font-medium max-w-[60vw] truncate text-center"
            style={{
              lineHeight: 1.5,
              backgroundColor:
                theme === "dark"
                  ? "rgba(26, 26, 26, 0.4)"
                  : "rgba(250, 250, 250, 0.6)",
              borderColor: colors.border,
              color: colors.text,
            }}
            title="[Product] Product roadmap"
          >
            <span className="text-sm font-semibold tracking-tight">
              [Product] Product roadmap
            </span>
          </div>
        </div>

        {/* RIGHT: mirrored placeholders (same visual slots as left) so center uses flex/grid centering */}
        <div className="flex items-center gap-3 justify-end">
          {/* placeholder for the logo slot */}
          <div className="flex items-center gap-1 rounded-lg p-1">
            <Tooltip content="Add people" delayDuration={0} side="bottom">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
                aria-label="Add people"
              >
                <Image
                  src="/icons/navbar/new-project.svg"
                  alt="Add people"
                  width={16}
                  height={16}
                  style={{ filter: theme === "light" ? "invert(1)" : "none" }}
                />
              </button>
            </Tooltip>
            <Tooltip content="Group View" delayDuration={75} side="bottom">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-md"
                style={{
                  backgroundColor: theme === "dark" ? "#2C2C2C" : "#F5F5F5",
                  color: colors.textSub,
                }}
              >
                <Image
                  src="/icons/navbar/group-view.svg"
                  alt="Group View"
                  width={16}
                  height={16}
                  style={{ filter: theme === "light" ? "invert(1)" : "none" }}
                />
              </span>
            </Tooltip>
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
