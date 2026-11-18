import { apiRequest } from '../utils/apiWrapper';

const base = '/api/categories';

export async function fetchCategories(page = 1, limit = 50) {
  const res = await apiRequest(`${base}?page=${page}&limit=${limit}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch categories');
  }
  return res.json();
}

export async function createCategory(payload) {
  const res = await apiRequest(base, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create category');
  }
  return res.json();
}

export async function updateCategory(id, payload) {
  const res = await apiRequest(`${base}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to update category');
  }
  return res.json();
}

export async function deleteCategory(id) {
  const res = await apiRequest(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to delete category');
  }
  return res.json();
}
