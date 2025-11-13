/* eslint-disable @next/next/no-img-element */
import { useId, useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useEditorContext } from "./editor-context";
import { useTheme } from "../../providers/theme-provider";

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
    id: "highlight",
    label: "Highlight",
    iconSrc: "/icons/toolbar/highlight.svg",
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
  { id: "subscript", label: "Subscript", iconSrc: "/icons/toolbar/subscript.svg" },
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
  const { theme } = useTheme();
  const colors = theme === "dark"
    ? { buttonBg: "#2C2C2C", buttonHover: "#333333", text: "#F2F2F2", tooltipBg: "#1A1A1A" }
    : { buttonBg: "#F5F5F5", buttonHover: "#E8E8E8", text: "#111111", tooltipBg: "#2C2C2C" };

  return (
    <div className="group relative flex items-center justify-center">
      <button
        type="button"
        aria-label={action.label}
        aria-describedby={tooltipId}
        onClick={onClick}
        className="flex h-9 w-9 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: colors.buttonBg,
          color: colors.text,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.buttonBg;
        }}
      >
        <img
          src={action.iconSrc}
          alt=""
          className="h-4 w-4 object-contain"
          draggable={false}
          style={{ filter: theme === "light" ? "invert(1)" : "none" }}
        />
      </button>

      {/* Tooltip container */}
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
          className="relative rounded-md px-3 py-1.5 text-[11px] font-medium shadow-md text-white"
          style={{ backgroundColor: colors.tooltipBg }}
          aria-hidden="false"
        >
          {action.label}
          <span
            className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
            style={{ backgroundColor: colors.tooltipBg }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

interface ColorOption {
  name: string;
  value: string;
  bgClass: string;
}

const HIGHLIGHT_COLORS: ColorOption[] = [
  { name: "Yellow", value: "#fef08a", bgClass: "bg-yellow-200" },
  { name: "Green", value: "#bbf7d0", bgClass: "bg-green-200" },
  { name: "Blue", value: "#bfdbfe", bgClass: "bg-blue-200" },
  { name: "Pink", value: "#fbcfe8", bgClass: "bg-pink-200" },
  { name: "Purple", value: "#e9d5ff", bgClass: "bg-purple-200" },
  { name: "Orange", value: "#fed7aa", bgClass: "bg-orange-200" },
];

const QUOTE_COLORS: ColorOption[] = [
  { name: "Cyan", value: "#22d3ee", bgClass: "bg-cyan-400" },
  { name: "Blue", value: "#3b82f6", bgClass: "bg-blue-500" },
  { name: "Green", value: "#10b981", bgClass: "bg-green-500" },
  { name: "Yellow", value: "#eab308", bgClass: "bg-yellow-500" },
  { name: "Red", value: "#ef4444", bgClass: "bg-red-500" },
  { name: "Purple", value: "#a855f7", bgClass: "bg-purple-500" },
];

function ColorPickerButton({
  action,
  colors,
}: {
  action: ToolbarAction;
  colors: ColorOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { executeActionWithColor } = useEditorContext();
  const { theme } = useTheme();
  const tooltipId = useId();

  const themeColors = theme === "dark"
    ? { buttonBg: "#2C2C2C", buttonHover: "#333333", text: "#F2F2F2", tooltipBg: "#1A1A1A", dropdownBg: "#1A1A1A", border: "#2C2C2C" }
    : { buttonBg: "#F5F5F5", buttonHover: "#E8E8E8", text: "#111111", tooltipBg: "#2C2C2C", dropdownBg: "#FFFFFF", border: "#DCDCDC" };

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

  const handleColorSelect = (color: string) => {
    executeActionWithColor(action.id, color);
    setIsOpen(false);
  };

  return (
    <div
      className="group relative flex items-center justify-center"
      ref={dropdownRef}
    >
      <button
        type="button"
        aria-label={action.label}
        aria-describedby={tooltipId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: isOpen ? themeColors.buttonHover : themeColors.buttonBg,
          color: themeColors.text,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = themeColors.buttonHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = themeColors.buttonBg;
          }
        }        }
      >
        <img
          src={action.iconSrc}
          alt=""
          className="h-4 w-4 object-contain"
          draggable={false}
          style={{ filter: theme === "light" ? "invert(1)" : "none" }}
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
            className="relative rounded-md px-3 py-1.5 text-[11px] font-medium shadow-md text-white"
            style={{ backgroundColor: themeColors.tooltipBg }}
            aria-hidden="false"
          >
            {action.label}
            <span
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
              style={{ backgroundColor: themeColors.tooltipBg }}
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* Color Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 mt-2 -translate-x-1/2 z-50 rounded-md shadow-lg p-2 grid grid-cols-3 gap-2 min-w-[150px] border"
          style={{
            backgroundColor: themeColors.dropdownBg,
            borderColor: themeColors.border,
          }}
        >
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorSelect(color.value)}
              className={cn(
                "w-10 h-10 rounded-md border-2 transition",
                color.bgClass
              )}
              style={{ borderColor: themeColors.border }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme === "dark" ? "#A6A6A6" : "#5A5A5A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = themeColors.border;
              }}
              title={color.name}
              aria-label={`${action.label} ${color.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeadingButton({ action }: { action: ToolbarAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { insertHeading } = useEditorContext();
  const { theme } = useTheme();
  const tooltipId = useId();

  const themeColors = theme === "dark"
    ? { buttonBg: "#2C2C2C", buttonHover: "#333333", text: "#F2F2F2", tooltipBg: "#1A1A1A", dropdownBg: "#1A1A1A", border: "#2C2C2C" }
    : { buttonBg: "#F5F5F5", buttonHover: "#E8E8E8", text: "#111111", tooltipBg: "#2C2C2C", dropdownBg: "#FFFFFF", border: "#DCDCDC" };

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
    <div
      className="group relative flex items-center justify-center"
      ref={dropdownRef}
    >
      <button
        type="button"
        aria-label={action.label}
        aria-describedby={tooltipId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: isOpen ? themeColors.buttonHover : themeColors.buttonBg,
          color: themeColors.text,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = themeColors.buttonHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = themeColors.buttonBg;
          }
        }}
      >
        <img
          src={action.iconSrc}
          alt=""
          className="h-4 w-4 object-contain"
          draggable={false}
          style={{ filter: theme === "light" ? "invert(1)" : "none" }}
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
            className="relative rounded-md px-3 py-1.5 text-[11px] font-medium shadow-md text-white"
            style={{ backgroundColor: themeColors.tooltipBg }}
            aria-hidden="false"
          >
            {action.label}
            <span
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
              style={{ backgroundColor: themeColors.tooltipBg }}
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 mt-2 -translate-x-1/2 z-50 rounded-md shadow-lg py-1 min-w-[120px] border"
          style={{
            backgroundColor: themeColors.dropdownBg,
            borderColor: themeColors.border,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleHeadingSelect(level)}
              className="w-full px-3 py-2 text-left text-sm transition"
              style={{ color: themeColors.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeColors.buttonHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
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
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "#1A1A1A" : "#F5F5F5";
  
  return (
    <div 
      className="flex items-center w-fit gap-1 px-1 py-1 shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      {actions.map((action) => {
        if (action.id === "heading") {
          return <HeadingButton key={action.id} action={action} />;
        }
        if (action.id === "highlight") {
          return (
            <ColorPickerButton
              key={action.id}
              action={action}
              colors={HIGHLIGHT_COLORS}
            />
          );
        }
        if (action.id === "quote") {
          return (
            <ColorPickerButton
              key={action.id}
              action={action}
              colors={QUOTE_COLORS}
            />
          );
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
  const { theme } = useTheme();

  const colors = theme === "dark"
    ? { bg: "#111111", border: "#2C2C2C" }
    : { bg: "#FAFAFA", border: "#DCDCDC" };

  return (
    <div 
      className="flex items-center justify-center gap-2 border-t py-2"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
      }}
    >
      <ToolbarActionGroup
        actions={GLOBAL_ACTIONS}
        onActionClick={executeAction}
      />

      <ToolbarActionGroup
        actions={PRIMARY_ACTIONS}
        onActionClick={executeAction}
      />

      <ToolbarActionGroup
        actions={SECONDARY_ACTIONS}
        onActionClick={executeAction}
      />

      <ToolbarActionGroup
        actions={INSERT_ACTIONS}
        onActionClick={executeAction}
      />
    </div>
  );
}
