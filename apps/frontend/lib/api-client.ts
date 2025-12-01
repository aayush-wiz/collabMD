const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
    if (!response.ok) throw new Error("Failed to fetch documents");
    return response.json();
  },

  get: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    if (!response.ok) throw new Error("Failed to fetch document");
    return response.json();
  },

  create: async (data: {
    title: string;
    content: string;
    isPublic?: boolean;
  }) => {
    const response = await api.post("/documents", data);
    if (!response.ok) throw new Error("Failed to create document");
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
    if (!response.ok) throw new Error("Failed to update document");
    return response.json();
  },

  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to delete document: ${response.statusText}`
      );
    }
    return response.json();
  },
};
