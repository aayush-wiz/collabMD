"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../providers/theme-provider";
import { useState } from "react";

interface DocumentCardProps {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

export function DocumentCard({
  id,
  title,
  preview,
  createdAt,
  onDelete,
}: DocumentCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClick = () => {
    router.push(`/editor/${id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col rounded-lg border p-5 transition-all hover:shadow-lg"
      style={{
        borderColor: theme === "dark" ? "#2C2C2C" : "#DCDCDC",
        backgroundColor: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme === "dark" ? "#4DA6FF" : "#007ACC";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme === "dark" ? "#2C2C2C" : "#DCDCDC";
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3
          className="line-clamp-2 text-lg font-semibold"
          style={{ color: theme === "dark" ? "#F2F2F2" : "#111111" }}
        >
          {title}
        </h3>
        <button
          onClick={handleDelete}
          className="ml-2 rounded p-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            backgroundColor: showDeleteConfirm ? "#DC2626" : "transparent",
            color: showDeleteConfirm ? "#FFFFFF" : theme === "dark" ? "#A6A6A6" : "#5A5A5A",
          }}
          onMouseEnter={(e) => {
            if (!showDeleteConfirm) {
              e.currentTarget.style.backgroundColor = theme === "dark" ? "#2C2C2C" : "#F0F0F0";
              e.currentTarget.style.color = "#DC2626";
            }
          }}
          onMouseLeave={(e) => {
            if (!showDeleteConfirm) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme === "dark" ? "#A6A6A6" : "#5A5A5A";
            }
          }}
          title="Delete document"
        >
          {showDeleteConfirm ? "Confirm" : "×"}
        </button>
      </div>

      <p
        className="mb-4 line-clamp-3 flex-1 text-sm"
        style={{ color: theme === "dark" ? "#A6A6A6" : "#5A5A5A" }}
      >
        {preview || "No preview available"}
      </p>

      <div
        className="text-xs"
        style={{ color: theme === "dark" ? "#A6A6A6" : "#5A5A5A" }}
      >
        {formatDate(createdAt)}
      </div>
    </div>
  );
}

