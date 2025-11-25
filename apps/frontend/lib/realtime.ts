"use client";

import { io, type Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
const CLIENT_ID_STORAGE_KEY = "collabmd:clientId";

let socket: Socket | null = null;
let clientId: string | null = null;

export type DocumentChangePayload = {
  documentId: string;
  content: string;
};

export type CursorMovePayload = {
  documentId: string;
  userId: string;
  from: number;
  to: number;
};

function createSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL, {
    autoConnect: true,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return createSocket();
}

export function getClientId(): string {
  if (clientId) return clientId;

  // On the server, generate a non-persistent ID
  if (typeof window === "undefined") {
    clientId = `server-${Math.random().toString(36).slice(2, 10)}`;
    return clientId;
  }

  // Try to reuse an existing client ID from localStorage
  try {
    const existing = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (existing) {
      clientId = existing;
      return clientId;
    }
  } catch {
    // ignore storage errors and fall through to generating a new ID
  }

  let generated: string;

  if (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.randomUUID === "function"
  ) {
    generated = window.crypto.randomUUID();
  } else {
    generated = `user_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }

  clientId = generated;

  try {
    window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, generated);
  } catch {
    // ignore storage errors
  }

  return clientId;
}

export function joinDocument(documentId: string): void {
  const s = createSocket();
  s?.emit("join-document", documentId);
}

export function leaveDocument(documentId: string): void {
  const s = getSocket();
  s?.emit("leave-document", documentId);
}

export function sendDocumentChange(payload: DocumentChangePayload): void {
  const s = getSocket();
  s?.emit("document-change", payload);
}

export function sendCursorMove(payload: CursorMovePayload): void {
  const s = getSocket();
  s?.emit("cursor-move", payload);
}

export function onDocumentUpdate(handler: (content: string) => void): () => void {
  const s = createSocket();
  if (!s) return () => {};

  const wrapped = (content: string) => {
    handler(content);
  };

  s.on("document-update", wrapped);

  return () => {
    s.off("document-update", wrapped);
  };
}

export function onCursorUpdate(
  handler: (payload: CursorMovePayload) => void,
): () => void {
  const s = createSocket();
  if (!s) return () => {};

  const wrapped = (payload: CursorMovePayload) => {
    handler(payload);
  };

  s.on("cursor-update", wrapped);

  return () => {
    s.off("cursor-update", wrapped);
  };
}
