// Check stock adjustments and adjustment stats via backend API.
// Usage: node server/scripts/test-stock-adjustments.js
// Optional env: API_URL (base, e.g. http://localhost:3000), ADMIN_EMAIL, ADMIN_PASSWORD

const BASE_URL = (process.env.API_URL || 'http://localhost:3000').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

let authToken = '';

async function login() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });

    const data = await response.json().catch(() => ({}));
    authToken = data.token || data.accessToken || data?.data?.token || '';
    if (response.ok && (data.success || authToken)) {
      console.log('Login successful');
      return true;
    }

    console.log('Login failed:', data.message || data?.error?.message || response.status);
    return false;
  } catch (error) {
    console.log('Login error:', error.message || error);
    return false;
  }
}

async function getStockAdjustments() {
  try {
    const response = await fetch(`${BASE_URL}/api/stock-adjustments`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      console.log('Failed to get adjustments:', data.message || data?.error?.message || response.status);
      return;
    }

    const payload = data.data || data;
    const adjustments = payload.adjustments || payload.items || [];
    const pagination = payload.pagination || {};
    const summary = payload.summary || [];

    console.log('\nSTOCK ADJUSTMENTS:');
    console.log(`Total adjustments: ${pagination.total ?? adjustments.length}`);

    if (adjustments.length > 0) {
      console.log('\nRecent adjustments:');
      adjustments.forEach((adj, index) => {
        console.log(`${index + 1}. ${adj.reference || adj._id || 'N/A'}`);
        console.log(`   Product: ${adj.product?.name || 'N/A'}`);
        console.log(`   Type: ${adj.type || 'N/A'}`);
        console.log(`   Quantity Change: ${adj.adjustmentQuantity ?? 'N/A'}`);
        console.log(`   Previous Stock: ${adj.previousStock ?? 'N/A'}`);
        console.log(`   New Stock: ${adj.newStock ?? 'N/A'}`);
        console.log(`   Reason: ${adj.reason || 'N/A'}`);
        console.log(`   Cost Impact: $${adj.costImpact ?? 0}`);
        console.log(`   Date: ${adj.createdAt ? new Date(adj.createdAt).toLocaleString() : 'N/A'}`);
        console.log(`   Performed By: ${adj.performedBy?.name || 'N/A'}`);
        console.log('   ---');
      });
    } else {
      console.log('No stock adjustments found');
    }

    if (Array.isArray(summary) && summary.length > 0) {
      console.log('\nSUMMARY BY TYPE:');
      summary.forEach((s) => {
        console.log(`${s._id}: ${s.count} adjustments, Total Qty: ${s.totalQuantity}, Cost Impact: $${s.totalCostImpact}`);
      });
    }
  } catch (error) {
    console.log('Error getting adjustments:', error.message || error);
  }
}

async function getAdjustmentStats() {
  try {
    const response = await fetch(`${BASE_URL}/api/stock-adjustments/stats`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      console.log('Failed to get stats:', data.message || data?.error?.message || response.status);
      return;
    }

    const payload = data.data || {};
    const summary = payload.summary || {};
    const byType = payload.byType || [];

    console.log('\nADJUSTMENT STATISTICS:');
    console.log(`Total Adjustments: ${summary.totalAdjustments ?? 0}`);
    console.log(`Total Cost Impact: $${summary.totalCostImpact ?? 0}`);
    console.log(`Average Cost Impact: $${Number(summary.avgCostImpact || 0).toFixed(2)}`);

    if (byType.length > 0) {
      console.log('\nBy Type:');
      byType.forEach((type) => {
        console.log(`  ${type._id}: ${type.count} adjustments, Total Cost: $${type.totalCost}`);
      });
    }
  } catch (error) {
    console.log('Error getting stats:', error.message || error);
  }
}

async function main() {
  console.log('Checking stock adjustments...\n');
  console.log(`API: ${BASE_URL}\n`);

  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('Cannot proceed without authentication');
    process.exitCode = 1;
    return;
  }

  await getStockAdjustments();
  await getAdjustmentStats();

  console.log('\nStock adjustment check completed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
