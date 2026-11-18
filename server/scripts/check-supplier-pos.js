// List suppliers and purchase orders via backend API.
// Usage: node server/scripts/check-supplier-pos.js
// Optional env: API_URL, ADMIN_EMAIL, ADMIN_PASSWORD

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

const checkSupplierPOs = async () => {
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

    const suppliersResponse = await fetch(`${BASE_URL}/api/suppliers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const suppliersData = await suppliersResponse.json().catch(() => ({}));
    const suppliers = Array.isArray(suppliersData)
      ? suppliersData
      : suppliersData.data?.items || suppliersData.data || suppliersData.suppliers || [];

    console.log('SUPPLIERS:');
    if (!suppliers.length) {
      console.log('- none');
    } else {
      suppliers.forEach((s) => console.log(`- ${s.name} (ID: ${s._id})`));
    }

    const posResponse = await fetch(`${BASE_URL}/api/purchase-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const posData = await posResponse.json().catch(() => ({}));
    const orders = posData.orders || posData.data?.orders || posData.data?.items || posData.items || [];

    console.log('\nPURCHASE ORDERS:');
    if (!orders.length) {
      console.log('- none');
    } else {
      orders.forEach((po) => {
        console.log(`- ${po.poNumber || po._id} -> ${po.supplier?.name || 'Unknown'} (${po.status || 'unknown'})`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message || error);
    process.exitCode = 1;
  }
};

checkSupplierPOs();
