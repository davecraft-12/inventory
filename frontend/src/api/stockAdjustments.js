import { apiRequest } from '../utils/apiWrapper';

const base = '/api/stock-adjustments';

export async function fetchStockAdjustments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(query ? `${base}?${query}` : base);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to fetch stock adjustments');
  }
  return res.json();
}

export async function createStockAdjustment(payload) {
  const res = await apiRequest(base, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to create stock adjustment');
  }
  return res.json();
}

export async function updateStockAdjustment(id, payload) {
  const res = await apiRequest(`${base}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to update stock adjustment');
  }
  return res.json();
}

export async function deleteStockAdjustment(id) {
  const res = await apiRequest(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to delete stock adjustment');
  }
  return res.json();
}
