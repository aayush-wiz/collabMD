// Utilities for storing markdown documents in browser localStorage
// Keyed collection stored at `collabmd:docs`

export type StoredDoc = {
  id: string;
  content: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
};

type DocMap = Record<string, StoredDoc>;

const STORAGE_KEY = "collabmd:docs";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAll(): DocMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as DocMap;
    }
    return {};
  } catch {
    return {};
  }
}

function writeAll(map: DocMap): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota or serialization errors
  }
}

function generateId(): string {
  if (isBrowser() && "crypto" in window && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  const rnd = Math.random().toString(36).slice(2);
  return `doc_${Date.now().toString(36)}_${rnd}`;
}

export function summarize(content: string): { title: string; preview: string } {
  const lines = content.split(/\r?\n/);
  let title = "Untitled";
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) {
      title = trimmed.replace(/^#+\s*/, "").trim() || "Untitled";
      break;
    }
    title = trimmed;
    break;
  }

  // Basic markdown stripping for preview
  let text = content;
  // remove code fences
  text = text.replace(/```[\s\S]*?```/g, " ");
  // remove inline code
  text = text.replace(/`[^`]*`/g, " ");
  // remove images/links formatting
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // remove markdown tokens
  text = text.replace(/[*_~>#-]+/g, " ");
  // collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  const preview = text.slice(0, 140);

  return { title, preview };
}

export function setTitle(content: string, newTitle: string): string {
  const lines = content.split(/\r?\n/);
  let firstNonEmptyIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().length > 0) {
      firstNonEmptyIndex = i;
      break;
    }
  }
  if (firstNonEmptyIndex === -1) {
    return `# ${newTitle}\n\n`;
  }
  const first = lines[firstNonEmptyIndex];
  if (/^#+\s+/.test(first.trim())) {
    lines[firstNonEmptyIndex] = `# ${newTitle}`;
    return lines.join("\n");
  }
  // Prepend title before existing content
  return `# ${newTitle}\n\n` + content;
}

export const localDocs = {
  list(): StoredDoc[] {
    const map = readAll();
    const docs = Object.values(map);
    return docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  get(id: string): StoredDoc | null {
    const map = readAll();
    return map[id] || null;
  },

  create(content: string): StoredDoc {
    const id = generateId();
    const now = new Date().toISOString();
    const { title, preview } = summarize(content);
    const doc: StoredDoc = {
      id,
      content,
      title,
      preview,
      createdAt: now,
      updatedAt: now,
    };
    const map = readAll();
    map[id] = doc;
    writeAll(map);
    return doc;
  },

  update(id: string, content: string): StoredDoc {
    const map = readAll();
    const existing = map[id];
    const now = new Date().toISOString();
    const { title, preview } = summarize(content);
    const updated: StoredDoc = existing
      ? {
          ...existing,
          content,
          title,
          preview,
          updatedAt: now,
        }
      : {
          id,
          content,
          title,
          preview,
          createdAt: now,
          updatedAt: now,
        };
    map[id] = updated;
    writeAll(map);
    return updated;
  },

  rename(id: string, newTitle: string): StoredDoc {
    const map = readAll();
    const existing = map[id];
    if (!existing) {
      return null as unknown as StoredDoc;
    }
    const updatedContent = setTitle(existing.content, newTitle);
    return this.update(id, updatedContent);
  },

  remove(id: string): void {
    const map = readAll();
    if (id in map) {
      delete map[id];
      writeAll(map);
    }
  },
};


