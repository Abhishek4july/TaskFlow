
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const token = localStorage.getItem('access_token');

  const headers = new Headers(options.headers);

  headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
