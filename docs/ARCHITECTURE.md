# Architecture Overview

## Summary

This project is a full-stack inventory management web application:

- **Frontend (`frontend/`)**: React single-page app built with Vite. Handles authentication state, role-based routing, dashboards, and inventory/customer workflows via backend APIs.
- **Backend (`server/`)**: Node.js + Express REST API with MongoDB/Mongoose models. Implements authentication, authorization/permissions, inventory entities, stock/purchase/sales operations, reporting, and validation/constraints.
- **Documentation (`docs/`)**: setup, architecture, web app behavior, API overview, and domain constraints.

## Technology stack

### Frontend
- React (with lazy-loaded route pages)
- React Router
- Vite (dev server/build tooling)
- Shared UI/layout components and centralized API modules (`src/api/*`, `src/utils/apiWrapper.js`)
- Auth/cart contexts for client state

### Backend
- Node.js (ES modules)
- Express
- MongoDB with Mongoose
- JWT-based authentication/refresh flow
- Role/permission-based route protection middleware

## Repository structure (high level)

```text
inventory/
├─ frontend/                 # Web client (Vite + React)
│  ├─ src/
│  │  ├─ api/                # API client modules
│  │  ├─ components/         # UI/layout/dashboard components
│  │  ├─ context/            # Auth/cart contexts and hooks
│  │  ├─ layouts/            # Dashboard/customer layouts
│  │  ├─ pages/              # Route pages (admin/manager/shared/auth/customer/inventory)
│  │  ├─ routes/             # Root/protected routing helpers
│  │  └─ utils/              # Shared utilities (e.g. api wrapper)
│  └─ vite.config.js         # Dev server + /api proxy config
├─ server/                   # API server
│  ├─ controllers/           # Request handlers/business actions
│  ├─ db/                    # DB connection
│  ├─ middleware/            # Auth/authorization/validation helpers
│  ├─ models/                # Mongoose schemas/models
│  ├─ routes/                # Express route modules mounted under /api/*
│  ├─ scripts/               # Standalone API/debug/maintenance scripts
│  ├─ public/                # Standalone server-served pages (supplier portal)
│  └─ index.js               # App bootstrap, middleware, route mounting, startup
├─ docs/                     # Project documentation
└─ README.md                 # Project entry-point documentation
```

## Backend architecture

### Entry point and startup
- `server/index.js` configures Express, CORS, JSON parsing, mounts route modules, and defines utility/debug endpoints.
- Connects to MongoDB via `server/db/connection.js`.
- Seeds default users if missing (development convenience), then starts HTTP server.

### API organization
- Routes are grouped by domain under `/api/*` (e.g. auth, products, categories, suppliers, users, orders, sales-orders, purchase-orders, stock adjustments, reports, barcodes, stock relationships).
- Controllers contain domain logic; middleware enforces authentication, roles, permissions, and some validation/constraints.

### Core domain entities (models)
Includes (non-exhaustive): `User`, `Product`, `Category`, `Supplier`, `Order`, `SalesOrder`, `PurchaseOrder`, `StockAdjustment`, `StockLog/StockCount` related models, notifications/approvals/templates, etc.

### Authorization model
- Authentication via JWT tokens (login/refresh endpoints).
- Role-based access control in routes/middleware (e.g. admin, manager, viewer, customer) with additional permission checks on certain operations.
- Some endpoints are intentionally public/special-case (e.g. customer order creation, supplier PO confirm/ship endpoints as implemented).

## Frontend architecture

### Routing and access control
- Public routes: root/login and fallback pages.
- Protected dashboard areas:
  - `/admin-dashboard` (admin)
  - `/manager-dashboard` (manager)
  - `/customer` (customer)
- `ProtectedRoutes` and layout components enforce role-based access and provide shared UI shells.

### Data access
- API calls are organized in `src/api/*` modules and/or routed through `src/utils/apiWrapper.js`.
- Vite dev proxy maps `/api` to the backend, enabling relative API paths in development.

### UI organization
- Pages are grouped by domain/role (`pages/admin`, `pages/manager`, `pages/shared`, `pages/auth`, `pages/customer`, `pages/inventory`).
- Reusable UI/layout/dashboard components live under `src/components/*`.

## Key workflows (high level)

- **Authentication**: user login → token-based API access → role-specific dashboard/navigation.
- **Inventory management**: products/categories/suppliers management, stock adjustments, physical counts, low-stock monitoring.
- **Procurement**: purchase orders lifecycle (create/send/confirm/ship/receive) with stock effects.
- **Sales/fulfillment**: sales orders and customer ordering flows (as exposed by UI/API).
- **Reporting**: stock/sales/movement/PO-related reports (role/permission dependent).

For domain constraints and relationship rules, see [CONSTRAINTS.md](CONSTRAINTS.md).
For endpoint-level overview, see [API.md](API.md).
For UI/page coverage, see [WEB_APP.md](WEB_APP.md).
