"use client";

import { useEffect } from "react";
import { EditorProvider } from "../components/editor/editor-context";
import { ThemeProvider, useTheme } from "../providers/theme-provider";
import { AuthProvider } from "../providers/auth-provider";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "dark" ? "#111111" : "#FAFAFA";
  }, [theme]);

  return <>{children}</>;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemeWrapper>
          <EditorProvider>{children}</EditorProvider>
        </ThemeWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}
