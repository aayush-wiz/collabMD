import { API_BASE_URL } from "./config";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function apiClient(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: FetchOptions = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  return response;
}

async function readErrorMessage(response: Response): Promise<string | null> {
  // Try to extract a useful message from JSON or text responses.
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => null);
      if (data && typeof data === "object") {
        // Common backend shapes: { error: string } or { message: string }
        const maybeError = (data as any).error ?? (data as any).message;
        if (typeof maybeError === "string" && maybeError.trim()) {
          return maybeError.trim();
        }
      }
      return null;
    }

    const text = await response.text().catch(() => "");
    const trimmed = text.trim();
    return trimmed ? trimmed : null;
  } catch {
    return null;
  }
}

export async function throwIfNotOk(
  response: Response,
  fallbackMessage: string
) {
  if (response.ok) return;

  // If auth failed, clear any cached auth so the UI can recover cleanly.
  if (
    typeof window !== "undefined" &&
    (response.status === 401 || response.status === 403)
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:logout"));
  }

  const serverMessage = await readErrorMessage(response);
  const message =
    serverMessage ||
    (response.status === 401 || response.status === 403
      ? "Your session has expired. Please sign in again."
      : fallbackMessage);

  throw new Error(`${message} (HTTP ${response.status})`);
}

// Helper functions for common HTTP methods
export const api = {
  get: (endpoint: string, options?: FetchOptions) =>
    apiClient(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: FetchOptions) =>
    apiClient(endpoint, { ...options, method: "DELETE" }),
};

// Typed API methods for documents
export const documentApi = {
  list: async () => {
    const response = await api.get("/documents");
    await throwIfNotOk(response, "Failed to fetch documents");
    return response.json();
  },

  get: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    await throwIfNotOk(response, "Failed to fetch document");
    return response.json();
  },

  create: async (data: {
    title: string;
    content: string;
    isPublic?: boolean;
  }) => {
    const response = await api.post("/documents", data);
    await throwIfNotOk(response, "Failed to create document");
    return response.json();
  },

  update: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      isPublic?: boolean;
    }
  ) => {
    const response = await api.put(`/documents/${id}`, data);
    await throwIfNotOk(response, "Failed to update document");
    return response.json();
  },

  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    await throwIfNotOk(response, "Failed to delete document");
    return response.json();
  },

  generateFromGitHub: async (githubUrl: string) => {
    const response = await api.post("/documents/generate-from-github", {
      githubUrl,
    });
    await throwIfNotOk(response, "Failed to generate document from GitHub");
    return response.json();
  },
};
