const API_BASE = import.meta.env.VITE_API_URL || '';

export function getToken() {
  return localStorage.getItem('sams_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('sams_token', token);
  else localStorage.removeItem('sams_token');
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Yêu cầu thất bại');
  }

  return data;
}
