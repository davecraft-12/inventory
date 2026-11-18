// Delete the first cancelled purchase order found (use with caution).
// Usage: node server/scripts/delete-cancelled-po.js
// Optional env: API_URL, ADMIN_EMAIL, ADMIN_PASSWORD

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

const deleteCancelledPO = async () => {
  try {
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const loginData = await loginResponse.json().catch(() => ({}));
    const token = loginData.token || loginData.accessToken || loginData?.data?.token;
    if (!loginResponse.ok || !token) {
      throw new Error(loginData?.message || loginData?.error?.message || `Login failed (${loginResponse.status})`);
    }

    const posResponse = await fetch(`${BASE_URL}/api/purchase-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const posData = await posResponse.json().catch(() => ({}));
    const orders = posData.orders || posData.data?.orders || posData.data?.items || posData.items || [];

    const cancelledPO = orders.find((po) => po.status === 'cancelled');
    if (!cancelledPO) {
      console.log('No cancelled purchase orders found');
      return;
    }

    console.log(`Found cancelled PO: ${cancelledPO.poNumber || cancelledPO._id}`);
    const deleteResponse = await fetch(`${BASE_URL}/api/purchase-orders/${cancelledPO._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (deleteResponse.ok) {
      console.log(`Deleted cancelled PO: ${cancelledPO.poNumber || cancelledPO._id}`);
    } else {
      const err = await deleteResponse.json().catch(() => ({}));
      console.error(`Failed to delete PO (${deleteResponse.status})`, err?.message || err?.error?.message || '');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Error:', error.message || error);
    process.exitCode = 1;
  }
};

deleteCancelledPO();
