# Web App Guide

This document describes the web application's main areas, routes, and role-based functionality (based on the current frontend routes and pages).

## Access and roles

The frontend uses protected routes and role checks for dashboard areas:

- **Admin** → `/admin-dashboard`
- **Manager** → `/manager-dashboard`
- **Customer** → `/customer`
- Public/auth routes → `/`, `/login`

Unauthorized or unknown routes show unauthorized/404 pages.

## Public / auth

- `/` — root/entry route
- `/login` — user login page

## Admin dashboard (`/admin-dashboard`, admin only)

Main admin pages/routes:

- `/admin-dashboard` — dashboard home
- `/admin-dashboard/products` — product management
- `/admin-dashboard/categories` — category management
- `/admin-dashboard/suppliers` — supplier management
- `/admin-dashboard/orders` — orders management
- `/admin-dashboard/users` — user management
- `/admin-dashboard/reports` — reports
- `/admin-dashboard/profile` — profile

(Actual available actions depend on backend permissions and API responses.)

## Manager dashboard (`/manager-dashboard`, manager only)

Main manager pages/routes:

- `/manager-dashboard` — manager dashboard overview
- `/manager-dashboard/stock-in` — stock in / manager products page
- `/manager-dashboard/products` — alias to stock in/products page
- `/manager-dashboard/stock-out` — sales orders / stock out page
- `/manager-dashboard/stock-adjustments` — stock adjustments
- `/manager-dashboard/physical-count` — physical count workflow (count variances and save adjustments)
- `/manager-dashboard/movement-history` — placeholder ("Coming Soon")
- `/manager-dashboard/low-stock` — low stock items
- `/manager-dashboard/purchase-orders` — purchase orders
- `/manager-dashboard/reports` — reports
- `/manager-dashboard/profile` — profile

### Notes on manager inventory pages
- **Stock In / Products**: view/search/filter products and perform stock-in style updates (as implemented by the manager products page).
- **Stock Out / Sales Orders**: create/manage sales orders and update fulfillment-related statuses (depending on API/data).
- **Physical Count**: compare system stock vs counted quantities, review variances, and save adjustments (including bulk variance save).

## Customer area (`/customer`, customer only)

Customer routes/pages:

- `/customer` — customer home
- `/customer/catalog` — browse catalog/products
- `/customer/cart` — cart
- `/customer/orders` — customer orders
- `/customer/profile` — customer profile

## Shared behavior and UI structure

- Frontend uses lazy-loaded pages with a loading fallback.
- Dashboard/customer areas use shared layouts (`DashboardLayout`, `CustomerLayout`).
- Pages rely on live backend APIs; when data is empty or unavailable, pages should show loading/empty/error states where implemented.

## Related docs

- [SETUP.md](SETUP.md) — local setup and running the app
- [ARCHITECTURE.md](ARCHITECTURE.md) — system/frontend/backend structure
- [API.md](API.md) — backend API overview
- [CONSTRAINTS.md](CONSTRAINTS.md) — business/domain constraints
