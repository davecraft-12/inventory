// Debug authentication and basic protected endpoint access via backend API.
// Usage: node server/scripts/debug-auth.js
// Optional env: API_URL, ADMIN_EMAIL, ADMIN_PASSWORD

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

const testAuth = async () => {
  try {
    console.log('Testing authentication...\n');
    console.log(`API: ${BASE_URL}`);
    console.log(`User: ${EMAIL}\n`);

    console.log('1. Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    const loginData = await loginResponse.json().catch(() => ({}));
    console.log('Login status:', loginResponse.status);
    console.log('Login response:', loginData);

    const token = loginData.token || loginData.accessToken || loginData?.data?.token;
    if (!loginResponse.ok || !token) {
      console.log('Login failed');
      process.exitCode = 1;
      return;
    }

    console.log('Login successful, token received\n');

    console.log('2. Testing debug endpoint (/api/debug/auth)...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const debugData = await debugResponse.json().catch(() => ({}));
    console.log('Debug status:', debugResponse.status);
    console.log('Debug response:', debugData);

    console.log('\n3. Testing purchase orders endpoint (/api/purchase-orders)...');
    const poResponse = await fetch(`${BASE_URL}/api/purchase-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const poData = await poResponse.json().catch(() => ({}));
    console.log('PO status:', poResponse.status);
    console.log('PO response:', poData);

    if (poResponse.ok) {
      console.log('\nPurchase orders endpoint OK');
    } else {
      console.log('\nPurchase orders endpoint failed');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Error:', error.message || error);
    process.exitCode = 1;
  }
};

testAuth();
