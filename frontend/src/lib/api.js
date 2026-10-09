const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';

export async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const fieldErrors = data?.error?.details?.fieldErrors;
    const validationMessage = fieldErrors && Object.values(fieldErrors).flat()[0];
    throw new Error(validationMessage || data?.error?.message || 'Request failed');
  }
  return data;
}
