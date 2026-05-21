// Browser-side API client with automatic refresh-token handling.
// The refresh token lives in an HTTP-only cookie set by the API; the access
// token is held in-memory only.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const { skipAuth, headers, ...rest } = opts;

  const doFetch = async (token: string | null) => {
    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };
    if (token && !skipAuth) finalHeaders.Authorization = `Bearer ${token}`;
    return fetch(url, { ...rest, headers: finalHeaders, credentials: 'include' });
  };

  let res = await doFetch(accessToken);

  // If unauthorized, try one refresh + retry
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) res = await doFetch(newToken);
  }

  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const message =
      (body as { message?: string | string[] } | null)?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return body as T;
}

// ── Typed helpers ──
export interface AuthUser {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),
  register: (email: string, password: string, name?: string) =>
    api<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
      skipAuth: true,
    }),
  refresh: () => refreshAccessToken(),
  me: () => api<AuthUser>('/api/auth/me'),
  logout: () => api<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
};
