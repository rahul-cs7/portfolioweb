const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;

export function supabaseUrl(path: string): string {
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in the server environment.");
  return `${url}${path}`;
}

export async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const endpoint = supabaseUrl(path);
  const response = await fetch(endpoint, {
    ...init,
    headers: { apikey: key!, ...init.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    let message = body;
    try { const error = JSON.parse(body); message = error.message || error.error || body; } catch { /* Keep the response text. */ }
    throw new Error(`Supabase request failed (${response.status}): ${message.slice(0, 300)}`);
  }
  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

export function jsonRequest(body: unknown, prefer?: string): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(prefer ? { Prefer: prefer } : {}) },
    body: JSON.stringify(body),
  };
}
