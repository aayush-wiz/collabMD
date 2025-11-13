"use client";

import Image from "next/image";

import { VIEW_MODES, useEditorContext } from "./editor-context";
import { cn } from "../../lib/utils";
import { Tooltip } from "../ui/tooltip";

export function EditorNavbar() {
  const { viewMode, setViewMode, theme, setTheme } = useEditorContext();

  return (
    <header className="w-full bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-800/90 border-b border-slate-800 text-slate-100 shadow-[0_10px_40px_rgba(5,10,12,0.75)] h-14">
      {/* grid layout: auto (left) | 1fr (center) | auto (right) */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center h-full px-4">
        {/* LEFT: real interactive controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90">
            COLLABMD
          </span>

          <div className="flex items-center gap-1 rounded-lg bg-slate-800/50 p-1 backdrop-blur-[2px]">
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
                      "flex h-9 w-9 items-center justify-center rounded-md transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                      isActive
                        ? "bg-emerald-400/95 text-slate-900 shadow-[inset_0_2px_6px_rgba(16,185,129,0.12)]"
                        : "text-slate-300 hover:bg-slate-700/55 hover:text-white"
                    )}
                  >
                    <Image src={src} alt={label} width={16} height={16} />
                  </button>
                </Tooltip>
              );
            })}
          </div>

          <Tooltip content="Create new" delayDuration={225} side="bottom">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/55 text-slate-300 transition hover:bg-slate-700/55 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/60"
              aria-label="Add new"
            >
              <Image
                src="/icons/navbar/new-project.svg"
                alt="New"
                width={16}
                height={16}
              />
            </button>
          </Tooltip>
        </div>

        {/* CENTER: flexible, naturally centered by grid */}
        <div className="flex justify-center">
          <div
            className="select-none bg-gradient-to-b from-slate-900/40 to-transparent backdrop-blur-sm rounded-md border border-slate-800/50 px-4 py-1.5 text-sm font-medium text-slate-100 max-w-[60vw] truncate text-center shadow-[0_4px_18px_rgba(6,10,8,0.45)]"
            style={{ lineHeight: 1.5 }}
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
            <Tooltip content="Create new" delayDuration={0} side="bottom">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/55 text-slate-300 transition hover:bg-slate-700/55 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/60"
                aria-label="Add new"
              >
                <Image
                  src="/icons/navbar/new-project.svg"
                  alt="New"
                  width={16}
                  height={16}
                />
              </button>
            </Tooltip>
            <Tooltip content="Group View" delayDuration={75} side="bottom">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/55 text-slate-300">
                <Image
                  src="/icons/navbar/group-view.svg"
                  alt="Group View"
                  width={16}
                  height={16}
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
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/55 text-slate-300 transition hover:bg-slate-700/55 hover:text-white"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <Image
                  src={`/icons/navbar/${theme === "dark" ? "light-theme" : "dark-theme"}.svg`}
                  alt={`${theme === "dark" ? "Light" : "Dark"} theme`}
                  width={16}
                  height={16}
                />
              </button>
            </Tooltip>
            <Tooltip content="Settings" delayDuration={225} side="bottom">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/55 text-slate-300 transition hover:bg-slate-700/55 hover:text-white"
                aria-label="Open Settings"
              >
                <Image
                  src="/icons/navbar/settings.svg"
                  alt="Settings"
                  width={16}
                  height={16}
                />
              </button>
            </Tooltip>
          </div>

          <Tooltip content="User Profile" delayDuration={300} side="bottom">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/55 text-slate-300 transition hover:bg-slate-700/55 hover:text-white"
              aria-label="Open User Profile"
            >
              <Image
                src="/icons/navbar/user.svg"
                alt="User Profile"
                width={16}
                height={16}
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
