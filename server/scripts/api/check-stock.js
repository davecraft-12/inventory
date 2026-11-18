// Check recent product stock and recent stock adjustments via backend API.
// Usage: node server/scripts/check-stock.js
// Optional env: API_URL, ADMIN_EMAIL, ADMIN_PASSWORD

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

const checkStock = async () => {
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

    const productsResponse = await fetch(`${BASE_URL}/api/products?limit=1000`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const productsData = await productsResponse.json().catch(() => ({}));
    const products = productsData.data?.items || productsData.items || productsData.products || [];

    const computer = (Array.isArray(products) ? products : []).find((p) =>
      String(p.name || '').toLowerCase().includes('computer')
    );
    if (computer) {
      console.log(`Computer stock: ${computer.stock}`);
    } else {
      console.log('Computer not found');
      console.log(`Products returned: ${Array.isArray(products) ? products.length : 0}`);
    }

    const adjResponse = await fetch(`${BASE_URL}/api/stock-adjustments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const adjData = await adjResponse.json().catch(() => ({}));
    const adjustments = adjData.data?.adjustments || adjData.adjustments || [];

    console.log('Recent adjustments:');
    if (!adjustments.length) {
      console.log('- none');
    } else {
      adjustments.slice(0, 5).forEach((adj) => {
        const qty = Number(adj.adjustmentQuantity ?? 0);
        console.log(`- ${adj.product?.name || 'N/A'}: ${qty >= 0 ? '+' : ''}${qty} (${adj.reason || 'n/a'})`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message || error);
    process.exitCode = 1;
  }
};

checkStock();
