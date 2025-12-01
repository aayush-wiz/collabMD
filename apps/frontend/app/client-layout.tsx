"use client";

import { useEffect } from "react";
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
          {children}
        </ThemeWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}
