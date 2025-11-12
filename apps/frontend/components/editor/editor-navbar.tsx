"use client";

import Image from "next/image";

import { VIEW_MODES, useEditorContext } from "./editor-context";
import { cn } from "../../lib/utils";

export function EditorNavbar() {
  const { viewMode, setViewMode } = useEditorContext();

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-200 shadow-lg shadow-slate-950/40">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          COLLABMD
        </span>

        <div className="flex items-center gap-1 rounded-lg bg-slate-800/70 p-1">
          {VIEW_MODES.map(({ key, label, src }) => {
            const isActive = viewMode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key)}
                aria-pressed={isActive}
                aria-label={label}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
                  isActive
                    ? "bg-cyan-400/90 text-slate-950 shadow-inner shadow-cyan-400/40"
                    : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
                )}
              >
                <Image src={src} alt={label} width={16} height={16} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800/70 text-slate-400 transition hover:bg-slate-700/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          aria-label="Add new"
        >
          <Image
            src="/icons/navbar/new-project.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
        [Product] Product roadmap
      </div>

      <div>
        <button
          type="button"
          aria-label="Open quick actions"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/70 text-slate-400 transition hover:bg-slate-700/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <Image
            src="/icons/navbar/group-view.svg"
            alt=""
            width={18}
            height={18}
          />
        </button>
      </div>
    </header>
  );
}
