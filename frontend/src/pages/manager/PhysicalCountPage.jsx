import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Search, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchProducts } from '../../api/products';
import { createStockAdjustment } from '../../api/stockAdjustments';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const PhysicalCountPage = () => {
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(1, 1000);
      const items = data.data?.items || data.items || data.products || [];
      const list = Array.isArray(items) ? items : [];
      setProducts(list);
      const initialCounts = {};
      list.forEach((p) => {
        initialCounts[p._id] = p.stock ?? 0;
      });
      setCounts(initialCounts);
    } catch (err) {
      console.error('Failed to load products for physical count:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !q || [p.name, p.sku, p.category?.name].some((v) => String(v || '').toLowerCase().includes(q));
      if (!matchesSearch) return false;
      const system = Number(p.stock ?? 0);
      const counted = Number(counts[p._id] ?? system);
      const variance = counted - system;
      if (filter === 'variance') return variance !== 0;
      if (filter === 'shortage') return variance < 0;
      if (filter === 'surplus') return variance > 0;
      return true;
    });
  }, [products, counts, search, filter]);

  const summary = useMemo(() => {
    let matched = 0;
    let variances = 0;
    let shortage = 0;
    let surplus = 0;
    products.forEach((p) => {
      const system = Number(p.stock ?? 0);
      const counted = Number(counts[p._id] ?? system);
      const diff = counted - system;
      if (diff === 0) matched += 1;
      else {
        variances += 1;
        if (diff < 0) shortage += 1;
        if (diff > 0) surplus += 1;
      }
    });
    return { total: products.length, matched, variances, shortage, surplus };
  }, [products, counts]);

  const setCount = (id, value) => {
    const num = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
    setCounts((prev) => ({ ...prev, [id]: num }));
  };

  const saveCount = async (product) => {
    const system = Number(product.stock ?? 0);
    const counted = Number(counts[product._id] ?? system);
    if (Number.isNaN(counted)) return;

    setSavingId(product._id);
    setError(null);
    setSuccess(null);
    try {
      if (counted !== system) {
        await createStockAdjustment({
          productId: product._id,
          quantity: counted,
          type: 'adjustment',
          reason: 'Physical count',
          notes: notes[product._id] || `Physical count recorded. System: ${system}, Counted: ${counted}`
        });
      }
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, stock: counted } : p)));
      setCounts((prev) => ({ ...prev, [product._id]: counted }));
      setSuccess(counted === system ? `${product.name}: count matches system stock.` : `${product.name}: stock updated to ${counted}.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save physical count:', err);
      setError(err.message || `Failed to save count for ${product.name}`);
    } finally {
      setSavingId(null);
    }
  };

  const saveAllVariances = async () => {
    const changed = products.filter((p) => Number(counts[p._id] ?? p.stock ?? 0) !== Number(p.stock ?? 0));
    if (changed.length === 0) {
      setSuccess('No variances to save. All counts match system stock.');
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    setSavingAll(true);
    setError(null);
    setSuccess(null);
    let saved = 0;
    try {
      for (const product of changed) {
        const system = Number(product.stock ?? 0);
        const counted = Number(counts[product._id] ?? system);
        await createStockAdjustment({
          productId: product._id,
          quantity: counted,
          type: 'adjustment',
          reason: 'Physical count',
          notes: notes[product._id] || `Bulk physical count. System: ${system}, Counted: ${counted}`
        });
        saved += 1;
      }
      await loadProducts();
      setSuccess(`Saved ${saved} physical count adjustment${saved === 1 ? '' : 's'}.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save all physical counts:', err);
      setError(err.message || 'Failed to save some physical counts');
    } finally {
      setSavingAll(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading products for physical count..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Physical Count"
        subtitle="Count on-hand inventory, review variances, and update stock records"
        breadcrumbs={['Dashboard', 'Manager', 'Physical Count']}
        actions={[
          <Button key="refresh" variant="outline" onClick={loadProducts} icon={<RefreshCw size={16} />}>Refresh</Button>,
          <Button key="save-all" onClick={saveAllVariances} icon={<Save size={16} />} disabled={savingAll || products.length === 0}>
            {savingAll ? 'Saving...' : 'Save Variances'}
          </Button>
        ]}
      />

      <div className="p-6 space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"><CheckCircle size={16} />{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <Card><Card.Content><div className="text-sm text-gray-500">Total Products</div><div className="text-2xl font-bold">{summary.total}</div></Card.Content></Card>
          <Card><Card.Content><div className="text-sm text-gray-500">Matched</div><div className="text-2xl font-bold text-green-600">{summary.matched}</div></Card.Content></Card>
          <Card><Card.Content><div className="text-sm text-gray-500">Variances</div><div className="text-2xl font-bold text-amber-600">{summary.variances}</div></Card.Content></Card>
          <Card><Card.Content><div className="text-sm text-gray-500">Shortages</div><div className="text-2xl font-bold text-red-600">{summary.shortage}</div></Card.Content></Card>
          <Card><Card.Content><div className="text-sm text-gray-500">Surplus</div><div className="text-2xl font-bold text-blue-600">{summary.surplus}</div></Card.Content></Card>
        </div>

        <Card>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by name, SKU, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="all">All Products</option>
                <option value="variance">With Variance</option>
                <option value="shortage">Shortages Only</option>
                <option value="surplus">Surplus Only</option>
              </select>
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 border rounded-lg px-3 py-2">
                <ClipboardCheck size={16} className="mr-2 text-blue-600" />
                Enter counted quantity and save per item or save all variances.
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Count Sheet</Card.Title>
          </Card.Header>
          <Card.Content>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="mx-auto mb-3 text-gray-400" size={28} />
                <p className="font-medium">No products found</p>
                <p className="text-sm mt-1">Try changing filters or add products in the system.</p>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Product</Table.Head>
                    <Table.Head>System Stock</Table.Head>
                    <Table.Head>Counted Qty</Table.Head>
                    <Table.Head>Variance</Table.Head>
                    <Table.Head>Notes</Table.Head>
                    <Table.Head>Action</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredProducts.map((product) => {
                    const system = Number(product.stock ?? 0);
                    const counted = counts[product._id] === '' ? '' : Number(counts[product._id] ?? system);
                    const variance = (counted === '' ? system : counted) - system;
                    return (
                      <Table.Row key={product._id}>
                        <Table.Cell>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku || '—'}{product.category?.name ? ` • ${product.category.name}` : ''}</div>
                        </Table.Cell>
                        <Table.Cell><span className="font-semibold">{system}</span></Table.Cell>
                        <Table.Cell>
                          <input
                            type="number"
                            min="0"
                            value={counted}
                            onChange={(e) => setCount(product._id, e.target.value)}
                            className="w-28 border rounded px-2 py-1"
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {variance === 0 ? (
                            <Badge variant="success">Match</Badge>
                          ) : variance < 0 ? (
                            <Badge variant="danger">{variance}</Badge>
                          ) : (
                            <Badge variant="primary">+{variance}</Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <input
                            type="text"
                            value={notes[product._id] || ''}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [product._id]: e.target.value }))}
                            placeholder="Optional note"
                            className="w-full min-w-[180px] border rounded px-2 py-1"
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="sm"
                            onClick={() => saveCount(product)}
                            disabled={savingId === product._id || counted === ''}
                            icon={<Save size={14} />}
                          >
                            {savingId === product._id ? 'Saving...' : 'Save'}
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default PhysicalCountPage;
