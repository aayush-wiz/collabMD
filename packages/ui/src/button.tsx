"use client";

import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appName: string;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/25 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60";

export const Button = ({
  appName,
  className,
  children,
  onClick,
  type = "button",
  ...rest
}: ButtonProps) => {
  const composedClassName = clsx(baseClasses, className);

  const handleClick: NonNullable<ButtonProps["onClick"]> = (event) => {
    if (onClick) {
      onClick(event);
      return;
    }

    alert(`Hello from your ${appName} app!`);
  };

  return (
    <button
      {...rest}
      type={type}
      className={composedClassName}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
