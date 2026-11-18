// frontend/src/App.jsx

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core Imports
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Root from "./routes/Root";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import DashboardLayout from "./layouts/DashboardLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import LoadingSpinner from "./components/ui/LoadingSpinner";

import "./App.css";
import { colors, fonts } from "./styles/theme";

// Auth & dashboard pages (lazy-loaded)
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const SuppliersPage = lazy(() => import("./pages/admin/SuppliersPage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const DashboardHomePage = lazy(() => import("./pages/shared/DashboardHomePage"));
const ProfilePage = lazy(() => import("./pages/shared/ProfilePage"));
const ReportsPage = lazy(() => import("./pages/shared/ReportsPage"));
const LowStockPage = lazy(() => import("./pages/manager/LowStockPage"));
const SalesOrdersPage = lazy(() => import("./pages/manager/SalesOrdersPage"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));
const ManagerProductsPage = lazy(() => import("./pages/manager/ManagerProductsPage"));
const PhysicalCountPage = lazy(() => import("./pages/manager/PhysicalCountPage"));
const PurchaseOrdersPage = lazy(() => import("./pages/inventory/PurchaseOrdersPage"));
const StockAdjustmentsPage = lazy(() => import("./pages/inventory/StockAdjustmentsPage"));
const CustomerHome = lazy(() => import("./pages/customer/CustomerHome"));
const CustomerCatalog = lazy(() => import("./pages/customer/CustomerCatalog"));
const CustomerOrders = lazy(() => import("./pages/customer/CustomerOrders"));
const CustomerCart = lazy(() => import("./pages/customer/CustomerCart"));
const CustomerProfile = lazy(() => import("./pages/customer/CustomerProfile"));

// Placeholder components for general pages
const UnauthorizedPage = () => <p className="font-bold text-3xl mt-20 text-center">Unauthorized</p>;
const NotFoundPage = () => <h1 className="text-xl">404 Not Found</h1>;

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
        fontFamily: fonts.main,
      }}
    >
      <Router>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
              <Routes>
                {/* Public/Root Layout Route */}
                <Route path="/" element={<Root />} />
                {/* Login Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Admin Dashboard - Protected Parent Route */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoutes requireRole={["admin"]}>
                      <DashboardLayout />
                    </ProtectedRoutes>
                  }
                >
                  {/* Admin-only routes */}
                  <Route index element={<DashboardHomePage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="suppliers" element={<SuppliersPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                </Route>

                {/* Manager Dashboard */}
                <Route
                  path="/manager-dashboard"
                  element={
                    <ProtectedRoutes requireRole={["manager"]}>
                      <DashboardLayout />
                    </ProtectedRoutes>
                  }
                >
                  {/* Manager-only routes */}
                  <Route index element={<ManagerDashboard />} />
                  <Route path="stock-in" element={<ManagerProductsPage />} />
                  <Route path="products" element={<ManagerProductsPage />} />
                  <Route path="stock-out" element={<SalesOrdersPage />} />
                  <Route path="stock-adjustments" element={<StockAdjustmentsPage />} />
                  <Route path="physical-count" element={<PhysicalCountPage />} />
                  <Route path="movement-history" element={<div>Movement History - Coming Soon</div>} />
                  <Route path="low-stock" element={<LowStockPage />} />
                  <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Customer dashboard */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoutes requireRole={["customer"]}>
                      <CustomerLayout />
                    </ProtectedRoutes>
                  }
                >
                  <Route index element={<CustomerHome />} />
                  <Route path="catalog" element={<CustomerCatalog />} />
                  <Route path="orders" element={<CustomerOrders />} />
                  <Route path="cart" element={<CustomerCart />} />
                  <Route path="profile" element={<CustomerProfile />} />
                </Route>

                {/* Authorization & Error Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
