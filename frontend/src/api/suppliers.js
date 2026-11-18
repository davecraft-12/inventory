import { apiRequest } from '../utils/apiWrapper';

const base = '/api/suppliers';

export async function fetchSuppliers() {
  const res = await apiRequest(base);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch suppliers');
  }
  return res.json();
}

export async function createSupplier(payload) {
  const res = await apiRequest(base, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create supplier');
  }
  return res.json();
}

export async function updateSupplier(id, payload) {
  const res = await apiRequest(`${base}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to update supplier');
  }
  return res.json();
}

export async function deleteSupplier(id) {
  const res = await apiRequest(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to delete supplier');
  }
  return res.json();
}
