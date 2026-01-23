"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../providers/theme-provider";
import Image from "next/image";
import { useAuth } from "../../providers/auth-provider";

interface WorkspaceHeaderProps {
  onOpenGitHubImport?: () => void;
}

export function WorkspaceHeader({ onOpenGitHubImport }: WorkspaceHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleNewDocument = () => {
    router.push("/editor/new");
  };
  const handleAuth = () => {
    if (user) {
      logout();
    } else {
      router.push("/signin");
    }
  };

  return (
    <header
      className="flex items-center justify-between border-b px-8 py-4"
      style={{
        borderColor: theme === "dark" ? "#2C2C2C" : "#DCDCDC",
        backgroundColor: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
      }}
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: theme === "dark" ? "#F2F2F2" : "#111111" }}
        >
          My Workspace
        </h1>
        <p
          className="text-sm"
          style={{ color: theme === "dark" ? "#A6A6A6" : "#5A5A5A" }}
        >
          Manage your markdown documents
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
          style={{
            borderColor: theme === "dark" ? "#2C2C2C" : "#DCDCDC",
            backgroundColor: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? "#2C2C2C" : "#F0F0F0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? "#1A1A1A" : "#FFFFFF";
          }}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <Image
            src={
              theme === "dark"
                ? "/icons/navbar/light-theme.svg"
                : "/icons/navbar/dark-theme.svg"
            }
            alt={theme === "dark" ? "Light theme" : "Dark theme"}
            width={20}
            height={20}
            className={theme === "dark" ? "" : "invert"}
          />
        </button>

        {user && (
          <>
            <button
              onClick={onOpenGitHubImport}
              className="rounded-lg px-4 py-2 font-medium transition-all"
              style={{
                backgroundColor: theme === "dark" ? "#2C2C2C" : "#F0F0F0",
                color: theme === "dark" ? "#F2F2F2" : "#111111",
                border: `1px solid ${theme === "dark" ? "#404040" : "#DCDCDC"}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "#404040" : "#E0E0E0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "#2C2C2C" : "#F0F0F0";
              }}
              title="Import documentation from GitHub repository"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Import from GitHub
              </span>
            </button>
            <button
              onClick={handleNewDocument}
              className="rounded-lg px-4 py-2 font-medium transition-all text-white"
              style={{
                backgroundColor: theme === "dark" ? "#4DA6FF" : "#007ACC",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "#3D8CE6" : "#005A9E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark" ? "#4DA6FF" : "#007ACC";
              }}
            >
              + New Document
            </button>
          </>
        )}

        <button
          onClick={handleAuth}
          className="rounded-lg px-4 py-2 font-medium transition-all text-white"
          style={{
            backgroundColor: theme === "dark" ? "#6B7280" : "#374151",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? "#4B5563" : "#1F2937";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? "#6B7280" : "#374151";
          }}
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </header>
  );
}

