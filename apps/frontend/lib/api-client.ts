const API_BASE_URL = "http://localhost:3001";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiClient(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const config: FetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
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

