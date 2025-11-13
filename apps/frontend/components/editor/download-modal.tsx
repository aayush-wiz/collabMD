"use client";

import { useTheme } from "../../providers/theme-provider";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Ensure pdfmake has vfs fonts available across bundlers
(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fontsModule = pdfFonts as any;
  const candidates = [
    fontsModule?.pdfMake?.vfs,
    fontsModule?.vfs,
    win?.pdfMake?.vfs,
  ];
  const found = candidates.find(Boolean);
  if (found) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdfMake as any).vfs = found;
  }
})();

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  documentId: string | null;
}

export function DownloadModal({
  isOpen,
  onClose,
  markdown,
  documentId,
}: DownloadModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const colors =
    theme === "dark"
      ? {
          bg: "#1A1A1A",
          text: "#F2F2F2",
          textSub: "#A6A6A6",
          border: "#2C2C2C",
          accent: "#4DA6FF",
          surface: "#252525",
        }
      : {
          bg: "#FFFFFF",
          text: "#111111",
          textSub: "#5A5A5A",
          border: "#DCDCDC",
          accent: "#007ACC",
          surface: "#F5F5F5",
        };

  const handleDownloadMarkdown = () => {
    const filename = documentId ? `${documentId}.md` : "document.md";
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleDownloadPDF = async () => {
    try {
      // 1) Convert Markdown -> HTML (GFM-like)
      type MarkdownItCtor = new (opts: {
        html: boolean;
        linkify: boolean;
        breaks: boolean;
      }) => {
        render: (md: string) => string;
      };
      const MarkdownItMod: unknown = await import("markdown-it");
      const MarkdownIt = (MarkdownItMod as { default: MarkdownItCtor }).default;
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        breaks: true,
      });
      let html = md.render(markdown);

      // Replace emojis with inline PNGs so pdfmake can render them
      await ensureTwemojiLoaded();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const twemoji: any = (window as unknown as { twemoji?: unknown }).twemoji;
      if (twemoji && typeof twemoji.parse === "function") {
        html = twemoji.parse(html, {
          base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
          folder: "72x72",
          ext: ".png",
          className: "emoji",
        });
      }
      html = await inlineEmojiPngs(html);

      // 2) Convert HTML -> pdfmake docDefinition content
      const rawHtmlToPdfmake: unknown = await import("html-to-pdfmake");
      const htmlToPdfmake =
        (
          rawHtmlToPdfmake as {
            default?: (h: string, opt?: unknown, w?: unknown) => unknown;
          }
        ).default ??
        (rawHtmlToPdfmake as unknown as (
          h: string,
          opt?: unknown,
          w?: unknown
        ) => unknown);
      const pdfmakeContent = htmlToPdfmake(html, { defaultStyles: {} }, window);

      // 3) Build docDefinition and download with pdfMake (vfs set at module init)

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 40, 40, 40],
        content: Array.isArray(pdfmakeContent)
          ? pdfmakeContent
          : [pdfmakeContent],
        styles: {
          h1: {
            fontSize: 22,
            bold: true,
            margin: [0, 12, 0, 6],
            color: "#111111",
          },
          h2: {
            fontSize: 18,
            bold: true,
            margin: [0, 12, 0, 6],
            color: "#111111",
          },
          h3: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
            color: "#111111",
          },
          p: { fontSize: 12, color: "#333333", margin: [0, 6, 0, 0] },
          code: {
            fontSize: 10,
            color: "#111111",
            background: "#F5F5F5",
            margin: [0, 4, 0, 4],
          },
          tableHeader: { bold: true, fillColor: "#F5F5F5", color: "#111111" },
        },
        defaultStyle: {
          fontSize: 12,
          color: "#111111",
        },
      };

      const filename = documentId ? `${documentId}.pdf` : "document.pdf";
      (
        pdfMake.createPdf as (docDef: unknown) => {
          download: (name: string) => void;
        }
      )(docDefinition).download(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      onClose();
    }
  };

  async function ensureTwemojiLoaded(): Promise<void> {
    if ((window as unknown as { twemoji?: unknown }).twemoji) return;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load twemoji"));
      document.head.appendChild(script);
    });
  }

  async function inlineEmojiPngs(inputHtml: string): Promise<string> {
    const container = document.createElement("div");
    container.innerHTML = inputHtml;
    const imgs = Array.from(container.querySelectorAll("img.emoji")) as HTMLImageElement[];
    await Promise.all(
      imgs.map(async (img) => {
        try {
          const url = img.getAttribute("src");
          if (!url) return;
          const res = await fetch(url);
          const blob = await res.blob();
          const dataUrl = await blobToDataURL(blob);
          img.setAttribute("src", dataUrl);
        } catch {
          // swallow single emoji failures
        }
      })
    );
    return container.innerHTML;
  }

  function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border shadow-2xl"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <div
          className="border-b px-6 py-4"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
            Download Document
          </h2>
          <p className="mt-1 text-sm" style={{ color: colors.textSub }}>
            Choose how you want to download your document
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Markdown Option */}
          <button
            onClick={handleDownloadMarkdown}
            className="w-full rounded-lg border p-4 text-left transition hover:shadow-md"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className="font-semibold text-base"
                  style={{ color: colors.text }}
                >
                  Raw Markdown
                </h3>
                <p className="mt-1 text-sm" style={{ color: colors.textSub }}>
                  Download as .md file for editing
                </p>
              </div>
              <div
                className="rounded-md px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: theme === "dark" ? "#2C2C2C" : "#E8E8E8",
                  color: colors.textSub,
                }}
              >
                .md
              </div>
            </div>
          </button>

          {/* PDF Option */}
          <button
            onClick={handleDownloadPDF}
            className="w-full rounded-lg border p-4 text-left transition hover:shadow-md"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className="font-semibold text-base"
                  style={{ color: colors.text }}
                >
                  Formatted PDF
                </h3>
                <p className="mt-1 text-sm" style={{ color: colors.textSub }}>
                  Download as styled PDF document
                </p>
              </div>
              <div
                className="rounded-md px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: theme === "dark" ? "#2C2C2C" : "#E8E8E8",
                  color: colors.textSub,
                }}
              >
                .pdf
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div
          className="border-t px-6 py-4 flex justify-end"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: colors.surface,
              color: colors.textSub,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === "dark" ? "#333333" : "#E8E8E8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
