const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const handle = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data;
};

export const apiClient = {
  get: (path: string) => handle(path),
  post: (path: string, body?: unknown) =>
    handle(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export const API_BASE_URL = API_BASE;
