// Nullish (not ||): production sets this to "" on purpose so requests stay
// same-origin through the nginx reverse proxy — an empty string must not
// fall back to the localhost default.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      // Let the browser set Content-Type (with the multipart boundary) for
      // FormData bodies — setting it manually breaks the upload.
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }

  return body;
}

const json = (data) => JSON.stringify(data);

export const authApi = {
  login: (email, password) => apiFetch("/api/auth/login", { method: "POST", body: json({ email, password }) }),
  verifyTwoFactor: (code) => apiFetch("/api/auth/2fa", { method: "POST", body: json({ code }) }),
  logout: () => apiFetch("/api/auth/logout", { method: "POST" }),
  logoutAll: () => apiFetch("/api/auth/logout-all", { method: "POST" }),
  me: () => apiFetch("/api/auth/me"),
};

export const projectsApi = {
  list: () => apiFetch("/api/projects"),
  getBySlug: (slug) => apiFetch(`/api/projects/${slug}`),
  create: (data) => apiFetch("/api/projects", { method: "POST", body: json(data) }),
  update: (id, data) => apiFetch(`/api/projects/${id}`, { method: "PUT", body: json(data) }),
  remove: (id) => apiFetch(`/api/projects/${id}`, { method: "DELETE" }),
};

export const docsApi = {
  list: (projectId) => apiFetch(`/api/projects/${projectId}/docs`),
  create: (projectId, data) =>
    apiFetch(`/api/projects/${projectId}/docs`, { method: "POST", body: json(data) }),
  update: (projectId, docId, data) =>
    apiFetch(`/api/projects/${projectId}/docs/${docId}`, { method: "PUT", body: json(data) }),
  remove: (projectId, docId) =>
    apiFetch(`/api/projects/${projectId}/docs/${docId}`, { method: "DELETE" }),
};

export const skillsApi = {
  list: () => apiFetch("/api/skills"),
  create: (data) => apiFetch("/api/skills", { method: "POST", body: json(data) }),
  update: (id, data) => apiFetch(`/api/skills/${id}`, { method: "PUT", body: json(data) }),
  remove: (id) => apiFetch(`/api/skills/${id}`, { method: "DELETE" }),
};

export const messagesApi = {
  list: () => apiFetch("/api/messages"),
  markRead: (id, read = true) =>
    apiFetch(`/api/messages/${id}`, { method: "PATCH", body: json({ read }) }),
};

export const settingsApi = {
  list: () => apiFetch("/api/settings"),
  update: (data) => apiFetch("/api/settings", { method: "PUT", body: json(data) }),
};

export const mediaApi = {
  list: () => apiFetch("/api/media"),
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch("/api/media", { method: "POST", body: form });
  },
  remove: (id) => apiFetch(`/api/media/${id}`, { method: "DELETE" }),
};

export const analyticsApi = {
  pageview: (path, referrer) =>
    apiFetch("/api/analytics/pageview", { method: "POST", body: json({ path, referrer }) }),
  summary: () => apiFetch("/api/analytics/summary"),
};

export const activityApi = {
  list: () => apiFetch("/api/activity"),
};

export const contactApi = {
  submit: (data) => apiFetch("/api/contact", { method: "POST", body: json(data) }),
};

export { API_URL };
