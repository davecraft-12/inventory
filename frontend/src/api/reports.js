import { apiRequest } from '../utils/apiWrapper';

const base = '/api/reports';

export async function fetchReport(type, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(query ? `${base}/${type}?${query}` : `${base}/${type}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to fetch report');
  }
  return res.json();
}
