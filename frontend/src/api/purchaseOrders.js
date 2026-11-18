import { apiRequest } from '../utils/apiWrapper';

const base = '/api/purchase-orders';

export async function fetchPurchaseOrders(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null))
  ).toString();
  const res = await apiRequest(query ? `${base}?${query}` : base);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to fetch purchase orders');
  }
  return res.json();
}

export async function createPurchaseOrder(payload) {
  const res = await apiRequest(base, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || `Failed to create purchase order${res.status ? ` (${res.status})` : ''}`);
  }
  return res.json();
}

export async function updatePurchaseOrderStatus(id, status) {
  const res = await apiRequest(`${base}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to update purchase order status');
  }
  return res.json();
}

export async function receivePurchaseOrder(id, receivedItems) {
  const res = await apiRequest(`${base}/${id}/receive`, {
    method: 'POST',
    body: JSON.stringify({ receivedItems }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || 'Failed to receive purchase order items');
  }
  return res.json();
}
