"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../providers/theme-provider";
import Image from "next/image";
import { useAuth } from "../../providers/auth-provider";

export function WorkspaceHeader() {
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
          <button
            onClick={handleNewDocument}
            className="rounded-lg px-4 py-2 font-medium transition-all text-white"
            style={{
              backgroundColor: theme === "dark" ? "#4DA6FF" : "#007ACC",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === "dark" ? "#3D8CE6" : "#005A9E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme === "dark" ? "#4DA6FF" : "#007ACC";
            }}
          >
            + New Document
          </button>
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

