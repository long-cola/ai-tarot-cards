const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001");

const defaultHeaders = {
  "Content-Type": "application/json",
};

const handle = async (path: string, options: RequestInit = {}) => {
  // Get token from localStorage (mobile fallback)
  const token = typeof window !== "undefined" ? localStorage.getItem('auth_token') : null;

  // Prepare headers
  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // Still include cookies for desktop browsers
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
