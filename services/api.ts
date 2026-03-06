// ─── Base API Client ──────────────────────────────────────────────────────────
// Uses the Android emulator loopback address (10.0.2.2) to reach localhost
// on the host machine where JSON-Server runs on port 3000.
// For physical devices, replace with the machine's LAN IP.
const BASE_URL = 'http://10.0.2.2:3000';

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status} on ${options?.method ?? 'GET'} ${path}`);
  }

  return response.json() as Promise<T>;
}

// ─── HTTP Methods ─────────────────────────────────────────────────────────────
export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}
