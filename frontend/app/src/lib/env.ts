function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

export const API_URL = normalizeBaseUrl(
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
);

