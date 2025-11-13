"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: string;
  delayDuration?: number;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  children,
  content,
  delayDuration = 0,
  side = "bottom",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8; // Distance from trigger element

    let top = 0;
    let left = 0;

    switch (side) {
      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "top":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

    setPosition({ top, left });
  }, [side]);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after showing to ensure correct dimensions
      requestAnimationFrame(calculatePosition);
    }, delayDuration);
  }, [delayDuration, calculatePosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        hideTooltip();
      }
    },
    [isVisible, hideTooltip]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition);
      window.addEventListener("resize", calculatePosition);
      return () => {
        window.removeEventListener("scroll", calculatePosition);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isVisible, calculatePosition]);

  const getArrowStyles = () => {
    const baseArrow = "absolute w-2 h-2 bg-slate-800 rotate-45";
    switch (side) {
      case "bottom":
        return `${baseArrow} -top-1 left-1/2 -translate-x-1/2`;
      case "top":
        return `${baseArrow} -bottom-1 left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseArrow} -right-1 top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseArrow} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return baseArrow;
    }
  };

  const getSlideStyles = () => {
    switch (side) {
      case "bottom":
        return isVisible ? "translate-y-0" : "-translate-y-2";
      case "top":
        return isVisible ? "translate-y-0" : "translate-y-2";
      case "left":
        return isVisible ? "translate-x-0" : "translate-x-2";
      case "right":
        return isVisible ? "translate-x-0" : "-translate-x-2";
      default:
        return "translate-y-0";
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-describedby={isVisible ? tooltipId.current : undefined}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>
      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId.current}
            role="tooltip"
            className={`fixed z-50 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-md shadow-lg backdrop-blur-sm border border-slate-700/50 pointer-events-none transition-all duration-200 ease-out ${
              isVisible ? "opacity-100" : "opacity-0 invisible"
            } ${getSlideStyles()}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div className={getArrowStyles()} />
            <span className="relative z-10">{content}</span>
          </div>,
          document.body
        )}
    </>
  );
}

