import { apiRequest } from '../utils/apiWrapper';

const base = '/api/users';

export async function createUser(payload) {
  const res = await apiRequest(base, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create user');
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await apiRequest(base);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch users');
  }
  return res.json();
}

export async function getUser(id) {
  const res = await apiRequest(`${base}/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch user');
  }
  return res.json();
}

export async function getMe() {
  const res = await apiRequest(`${base}/me`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to fetch profile');
  }
  return res.json();
}

export async function updateUser(id, payload) {
  const res = await apiRequest(`${base}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to update user');
  }
  return res.json();
}

export async function updateMe(payload) {
  const res = await apiRequest(`${base}/me`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to update profile');
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await apiRequest(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to delete user');
  }
  return res.json();
}
