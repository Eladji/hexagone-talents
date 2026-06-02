export const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

function getErrorMessage(data, fallback) {
  const message = data?.message || data?.detail?.message || data?.detail || fallback;
  return typeof message === "string" ? message : JSON.stringify(message);
}

async function readJsonResponse(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function createApi(session, setToast) {
  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(session ? { "X-User-Role": session.role, "X-User-Id": session.user_id } : {}),
        ...options.headers,
      },
    });
    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Erreur API"));
    }
    return data;
  }

  return {
    request,
    safe: async (fallback, fn) => {
      try {
        return await fn();
      } catch (error) {
        setToast(error.message);
        return fallback;
      }
    },
  };
}

export async function loginRequest(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await readJsonResponse(response);
  if (!response.ok) throw new Error(getErrorMessage(data, "Connexion impossible"));
  return data;
}

export async function registerRequest(payload) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readJsonResponse(response);
  if (!response.ok) throw new Error(getErrorMessage(data, "Inscription impossible"));
  return data;
}
