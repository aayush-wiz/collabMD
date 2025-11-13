/* eslint-disable @next/next/no-img-element */
import { useId, useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useEditorContext } from "./editor-context";

interface ToolbarAction {
  id: string;
  label: string;
  iconSrc: string;
}

const GLOBAL_ACTIONS: ToolbarAction[] = [
  { id: "undo", label: "Undo", iconSrc: "/icons/toolbar/undo.svg" },
  { id: "redo", label: "Redo", iconSrc: "/icons/toolbar/redo.svg" },
];

const PRIMARY_ACTIONS: ToolbarAction[] = [
  { id: "bold", label: "Bold", iconSrc: "/icons/toolbar/bold.svg" },
  { id: "italic", label: "Italics", iconSrc: "/icons/toolbar/italics.svg" },
  {
    id: "underline",
    label: "Underline",
    iconSrc: "/icons/toolbar/underline.svg",
  },
  {
    id: "strikethrough",
    label: "Strikethrough",
    iconSrc: "/icons/toolbar/strikethrough.svg",
  },
  { id: "heading", label: "Heading", iconSrc: "/icons/toolbar/heading.svg" },
];

const SECONDARY_ACTIONS: ToolbarAction[] = [
  { id: "code", label: "Code", iconSrc: "/icons/toolbar/code.svg" },
  { id: "quote", label: "Quote", iconSrc: "/icons/toolbar/quotes.svg" },
  {
    id: "bullet",
    label: "Bullet points",
    iconSrc: "/icons/toolbar/bullet-list.svg",
  },
  {
    id: "numbered",
    label: "Numbered points",
    iconSrc: "/icons/toolbar/number-list.svg",
  },
  {
    id: "checkbox",
    label: "Checkbox",
    iconSrc: "/icons/toolbar/checkbox.svg",
  },
];

const INSERT_ACTIONS: ToolbarAction[] = [
  { id: "link", label: "Link", iconSrc: "/icons/toolbar/link.svg" },
  { id: "image", label: "Image", iconSrc: "/icons/toolbar/image.svg" },
  { id: "table", label: "Table", iconSrc: "/icons/toolbar/table.svg" },
  {
    id: "divider",
    label: "Divider",
    iconSrc: "/icons/toolbar/divider.svg",
  },
];

function ToolbarButton({
  action,
  onClick,
}: {
  action: ToolbarAction;
  onClick?: () => void;
}) {
  const tooltipId = useId();

  return (
    <div className="group relative flex items-center justify-center">
      <button
        type="button"
        aria-label={action.label}
        aria-describedby={tooltipId}
        onClick={onClick}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md transition",
          "bg-slate-800/50 text-slate-200 shadow-inner shadow-slate-950/30",
          "hover:bg-slate-700/70 hover:text-white",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        )}
      >
        <img
          src={action.iconSrc}
          alt=""
          className="h-4 w-4 object-contain"
          draggable={false}
        />
      </button>

      {/* Tooltip container — always in DOM so transitions and a11y work */}
      <div
        id={tooltipId}
        role="tooltip"
        className={cn(
          "absolute top-full left-1/2 mt-2 -translate-x-1/2 flex-col items-center",
          "pointer-events-none",
          "opacity-0 translate-y-1",
          "group-hover:opacity-100 group-hover:translate-y-0",
          "group-focus-within:opacity-100 group-focus-within:translate-y-0",
          "transition-all duration-150 ease-out"
        )}
      >
        <div
          className="relative rounded-md bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-md shadow-black/40"
          aria-hidden="false"
        >
          {action.label}
          <span
            className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-950"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

function HeadingButton({ action }: { action: ToolbarAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { insertHeading } = useEditorContext();
  const tooltipId = useId();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleHeadingSelect = (level: number) => {
    insertHeading(level);
    setIsOpen(false);
  };

  return (
    <div className="group relative flex items-center justify-center" ref={dropdownRef}>
      <button
        type="button"
        aria-label={action.label}
        aria-describedby={tooltipId}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md transition",
          "bg-slate-800/50 text-slate-200 shadow-inner shadow-slate-950/30",
          "hover:bg-slate-700/70 hover:text-white",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
          isOpen && "bg-slate-700/70"
        )}
      >
        <img
          src={action.iconSrc}
          alt=""
          className="h-4 w-4 object-contain"
          draggable={false}
        />
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute top-full left-1/2 mt-2 -translate-x-1/2 flex-col items-center",
            "pointer-events-none",
            "opacity-0 translate-y-1",
            "group-hover:opacity-100 group-hover:translate-y-0",
            "group-focus-within:opacity-100 group-focus-within:translate-y-0",
            "transition-all duration-150 ease-out"
          )}
        >
          <div
            className="relative rounded-md bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-md shadow-black/40"
            aria-hidden="false"
          >
            {action.label}
            <span
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-950"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-1/2 mt-2 -translate-x-1/2 z-50",
            "bg-slate-900 border border-slate-700 rounded-md shadow-lg shadow-black/40",
            "py-1 min-w-[120px]"
          )}
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleHeadingSelect(level)}
              className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 transition"
            >
              Heading {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolbarActionGroup({
  actions,
  onActionClick,
}: {
  actions: ToolbarAction[];
  onActionClick: (actionId: string) => void;
}) {
  return (
    <div className="flex items-center w-fit gap-1 bg-slate-900/60 px-1 py-1 shadow-sm shadow-slate-950/40">
      {actions.map((action) => {
        if (action.id === "heading") {
          return <HeadingButton key={action.id} action={action} />;
        }
        return (
          <ToolbarButton
            key={action.id}
            action={action}
            onClick={() => onActionClick(action.id)}
          />
        );
      })}
    </div>
  );
}

export function EditorToolbar() {
  const { executeAction } = useEditorContext();

  return (
    <div className="flex items-center justify-center gap-2 border-t border-slate-800/80 bg-slate-950/40 py-2">
      <ToolbarActionGroup actions={GLOBAL_ACTIONS} onActionClick={executeAction} />

      <ToolbarActionGroup actions={PRIMARY_ACTIONS} onActionClick={executeAction} />

      <ToolbarActionGroup actions={SECONDARY_ACTIONS} onActionClick={executeAction} />

      <ToolbarActionGroup actions={INSERT_ACTIONS} onActionClick={executeAction} />
    </div>
  );
}
