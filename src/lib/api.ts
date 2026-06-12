"use client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

// ── Token helpers ─────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("petshop_auth");
    if (!raw) return null;
    return (JSON.parse(raw) as { token?: string }).token ?? null;
  } catch {
    return null;
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `HTTP ${res.status}`);
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

// ── API surface ───────────────────────────────────────────────────────────────
export const api = {
  get:    <T>(url: string)                     => request<T>(url),
  post:   <T>(url: string, body?: unknown)     => request<T>(url, { method: "POST",   body: JSON.stringify(body)   }),
  put:    <T>(url: string, body?: unknown)     => request<T>(url, { method: "PUT",    body: JSON.stringify(body)   }),
  patch:  <T>(url: string, body?: unknown)     => request<T>(url, { method: "PATCH",  body: JSON.stringify(body)   }),
  delete: <T>(url: string)                     => request<T>(url, { method: "DELETE"                              }),
};

// ── Query-string builder ──────────────────────────────────────────────────────
export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}
