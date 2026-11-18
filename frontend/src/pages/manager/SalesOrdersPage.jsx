import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Truck, CheckCircle, XCircle, Package, Users, DollarSign } from 'lucide-react';
import { apiRequest } from '../../utils/apiWrapper';
import { useAuth } from '../../context/useAuth';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const emptyOrder = {
  customer: '',
  items: [{ product: '', quantity: 1, unitPrice: 0 }],
  notes: ''
};

const SalesOrdersPage = () => {
  const { user } = useAuth();
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', customer: '', search: '' });
  const [newOrder, setNewOrder] = useState(emptyOrder);

  const canCreate = ['admin', 'manager'].includes(user?.role);
  const canUpdate = ['admin', 'manager'].includes(user?.role);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      );

      const [ordersRes, customersRes, productsRes] = await Promise.all([
        apiRequest(`/api/sales-orders${params.toString() ? `?${params}` : ''}`),
        apiRequest('/api/users?role=customer'),
        apiRequest('/api/products?limit=1000')
      ]);

      const [ordersData, customersData, productsData] = await Promise.all([
        ordersRes.json().catch(() => ({})),
        customersRes.json().catch(() => ({})),
        productsRes.json().catch(() => ({}))
      ]);

      const orderItems = ordersData.orders || ordersData.data?.orders || ordersData.data?.items || ordersData.data || ordersData.items || [];
      const customerItems = customersData.data?.items || customersData.data?.users || customersData.data || customersData.users || customersData.items || customersData;
      const productItems = productsData.data?.items || productsData.data?.products || productsData.data || productsData.items || productsData.products || productsData;

      setSalesOrders(Array.isArray(orderItems) ? orderItems : []);
      setCustomers(Array.isArray(customerItems) ? customerItems : []);
      setProducts(Array.isArray(productItems) ? productItems : []);
    } catch (err) {
      console.error('Error fetching sales order data:', err);
      setError('Failed to load sales orders data. Please check the server connection and try again.');
      setSalesOrders([]);
      setCustomers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!canCreate) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...newOrder,
        items: newOrder.items
          .filter(item => item.product)
          .map(item => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.unitPrice) || 0
          }))
      };

      const response = await apiRequest('/api/sales-orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || err?.message || 'Failed to create sales order');
      }

      setShowCreateForm(false);
      setNewOrder(emptyOrder);
      await fetchData();
    } catch (err) {
      console.error('Error creating sales order:', err);
      setError(err.message || 'Error creating sales order');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!canUpdate) return;

    try {
      const response = await apiRequest(`/api/sales-orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || err?.message || 'Failed to update status');
      }
      await fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message || 'Error updating sales order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'primary',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'default';
  };

  const addItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const updateItem = (index, field, value) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((_, i) => i !== index)
    }));
  };

  const stats = useMemo(() => {
    const total = salesOrders.length;
    const pending = salesOrders.filter(o => o.status === 'pending').length;
    const delivered = salesOrders.filter(o => o.status === 'delivered').length;
    const revenue = salesOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    return { total, pending, delivered, revenue };
  }, [salesOrders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Stock Out / Sales Orders"
        subtitle="Manage outbound orders, fulfillment status, and customer deliveries"
        breadcrumbs={['Dashboard', 'Manager', 'Stock Out']}
        actions={canCreate ? [
          <Button
            key="create"
            onClick={() => setShowCreateForm(true)}
            icon={<Plus />}
          >
            New Sales Order
          </Button>
        ] : []}
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card><Card.Content><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{stats.total}</p></div><Package className="text-blue-600" /></div></Card.Content></Card>
          <Card><Card.Content><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div><Users className="text-amber-600" /></div></Card.Content></Card>
          <Card><Card.Content><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Delivered</p><p className="text-2xl font-bold">{stats.delivered}</p></div><CheckCircle className="text-green-600" /></div></Card.Content></Card>
          <Card><Card.Content><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Revenue</p><p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p></div><DollarSign className="text-purple-600" /></div></Card.Content></Card>
        </div>

        <Card>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by order number..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                icon={<Search />}
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.customer}
                onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Customers</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>{customer.name || customer.email}</option>
                ))}
              </select>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Sales Orders</Card.Title>
          </Card.Header>
          <Card.Content>
            {loading ? (
              <LoadingSpinner text="Loading sales orders..." />
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Order Number</Table.Head>
                    <Table.Head>Customer</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Total Amount</Table.Head>
                    <Table.Head>Order Date</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {salesOrders.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={6}>
                        <div className="text-center py-10 text-gray-500">
                          <Package className="mx-auto mb-3 text-gray-400" size={28} />
                          <p className="font-medium">No sales orders found</p>
                          <p className="text-sm mt-1">Create a new order or adjust filters to see results.</p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    salesOrders.map(order => (
                      <Table.Row key={order._id}>
                        <Table.Cell className="font-medium">{order.orderNumber || order._id}</Table.Cell>
                        <Table.Cell>{order.customer?.name || order.customerName || 'N/A'}</Table.Cell>
                        <Table.Cell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status || 'unknown'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>${Number(order.totalAmount || 0).toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2 flex-wrap">
                            {canUpdate && order.status === 'pending' && (
                              <Button size="sm" onClick={() => updateStatus(order._id, 'confirmed')} icon={<CheckCircle />} variant="success">Confirm</Button>
                            )}
                            {canUpdate && order.status === 'confirmed' && (
                              <Button size="sm" onClick={() => updateStatus(order._id, 'shipped')} icon={<Truck />} variant="primary">Ship</Button>
                            )}
                            {canUpdate && ['pending', 'confirmed'].includes(order.status) && (
                              <Button size="sm" onClick={() => updateStatus(order._id, 'cancelled')} icon={<XCircle />} variant="danger">Cancel</Button>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>

        {/* Create Order Modal */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => !saving && setShowCreateForm(false)}
          title="Create Sales Order"
          size="lg"
        >
          <form onSubmit={handleCreateOrder}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <select
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, customer: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name || customer.email || customer._id}
                    </option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No customers found. Add users with customer role to create orders.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Items</label>
                  <span className="text-sm text-gray-600">
                    Total: ${newOrder.items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)), 0).toFixed(2)}
                  </span>
                </div>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2 items-center">
                    <select
                      value={item.product}
                      onChange={(e) => {
                        const productId = e.target.value;
                        const selected = products.find(p => p._id === productId);
                        setNewOrder(prev => ({
                          ...prev,
                          items: prev.items.map((it, i) => i === index ? {
                            ...it,
                            product: productId,
                            unitPrice: selected ? Number(selected.price ?? selected.unitPrice ?? it.unitPrice ?? 0) : it.unitPrice
                          } : it)
                        }));
                      }}
                      className="border rounded px-2 py-2 md:col-span-5"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.name} (Stock: {product.stock ?? 0})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="border rounded px-2 py-2 md:col-span-2"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="border rounded px-2 py-2 md:col-span-2"
                      step="0.01"
                      min="0"
                      required
                    />
                    <div className="md:col-span-2 text-sm font-medium px-1">
                      ${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}
                    </div>
                    <div className="md:col-span-1">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={newOrder.items.length === 1}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addItem} variant="ghost" size="sm">
                  + Add Item
                </Button>
                {products.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No products found. Add products first so they can be selected here.</p>
                )}
              </div>

              <Input
                label="Notes"
                value={newOrder.notes}
                onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Order notes..."
              />
            </div>

            <Modal.Footer>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !newOrder.customer || newOrder.items.some(i => !i.product)}>
                {saving ? 'Creating...' : 'Create Sales Order'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default SalesOrdersPage;
