import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth";
import { API_BASE } from "./config";

type FetchOptions = RequestInit & { retry?: boolean };

/**
 * fetchWithAuth accepts either:
 *  - relative path starting with "/" (it will prepend API_BASE), or
 *  - full URL starting with "http".
 */
export async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  const access = getAccessToken();
  if (access) headers.set("Authorization", `Bearer ${access}`);
  if ((options.method || "GET").toUpperCase() !== "GET" && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const finalUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
  let res = await fetch(finalUrl, { ...options, headers });

  if (res.status === 401 && !options.retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const newAccess = getAccessToken();
      if (newAccess) {
        headers.set("Authorization", `Bearer ${newAccess}`);
        const retryOptions = { ...options, headers, retry: true } as RequestInit;
        res = await fetch(finalUrl, retryOptions);
      }
    } else {
      clearTokens();
    }
  }
  return res;
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    const tokens: any = {};
    if (data.access) tokens.access = data.access;
    if (data.refresh) tokens.refresh = data.refresh;
    setTokens(tokens);
    return true;
  } catch (err) {
    console.error("refresh error", err);
    return false;
  }
}
