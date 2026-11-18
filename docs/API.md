# API Overview

Base URL (local): `http://localhost:3000`

Most application APIs are mounted under `/api/*` in `server/index.js`. Authentication/authorization is enforced per route (JWT and role/permission middleware), with some public/special-case endpoints.

> This is a high-level overview based on route modules and route definitions. For exact request/response schemas, inspect the corresponding controllers/models.

## Non-API / utility endpoints

- `GET /` — API welcome message
- `GET /supplier-portal` — serves standalone supplier portal page (`server/public/supplier-portal.html`)
- `GET /api/debug/auth` — returns basic auth header/token presence info (debug)
- `GET /api/debug/users` — lists users (debug)

## Auth (`/api/auth`)

- `POST /login` — login
- `POST /refresh-token` — refresh token
- `POST /refresh` — refresh token (alias)

## Users (`/api/users`)

- `GET /` — list users (admin)
- `POST /` — create user (admin)
- `GET /me` — current user profile
- `PATCH /me` — update current user profile
- `GET /:id` — get user by ID (admin)
- `PATCH /:id` — update user (admin)
- `DELETE /:id` — delete user (admin)

## Products (`/api/products`)

- `GET /` — list products (viewer+ as configured)
- `GET /:id` — get product by ID
- `POST /` — create product (manager + permission checks)
- `PATCH /:id` — update product (manager + permission checks)
- `DELETE /:id` — delete product (manager + permission checks)

## Categories (`/api/categories`)

- `GET /` — list categories
- `GET /:id` — get category by ID
- `POST /` — create category (admin)
- `PATCH /:id` — update category (admin)
- `DELETE /:id` — delete category (admin)

## Suppliers (`/api/suppliers`)

- `GET /` — list suppliers
- `GET /:id` — get supplier by ID
- `POST /` — create supplier (admin)
- `PATCH /:id` — update supplier (admin)
- `DELETE /:id` — delete supplier (admin)

## Orders (`/api/orders`)

- `GET /` — list orders (admin)
- `GET /my` — current user's orders
- `GET /:id` — get order by ID (admin)
- `POST /` — create order (public/customer order placement)
- `PATCH /:id/status` — update order status (admin)
- `PATCH /:id` — update order (admin)
- `DELETE /:id` — delete order (admin)

## Sales Orders (`/api/sales-orders`)

- `GET /` — list sales orders (manager)
- `POST /` — create sales order (manager + permission checks)
- `PATCH /:id/status` — update sales order status (manager + permission checks)
- `DELETE /:id` — delete sales order (manager + permission checks)

## Purchase Orders (`/api/purchase-orders`)

- `GET /` — list purchase orders (manager)
- `POST /` — create purchase order (manager + permission/validation)
- `PATCH /:id/status` — update PO status (manager + permission/validation)
- `POST /:id/send` — send PO
- `POST /:id/confirm` — supplier confirms PO (public endpoint)
- `POST /:id/ship` — supplier marks PO shipped (public endpoint)
- `POST /:id/receive` — receive PO / stock receipt flow (manager + permission)
- `DELETE /:id` — delete PO (manager + permission checks)

## Stock (`/api/stock`)

- `POST /add` — add stock (admin)
- `POST /reduce` — reduce stock (admin)
- `GET /logs` — stock logs (admin)

## Stock Adjustments (`/api/stock-adjustments`)

- `GET /` — list stock adjustments (manager)
- `GET /stats` — adjustment statistics
- `GET /:id` — get adjustment by ID
- `POST /` — create adjustment (manager + permission/validation)
- `POST /bulk` — bulk adjustment (manager + permission)
- `POST /cycle-count` — cycle count adjustment flow (manager + permission)
- `PATCH /:id/status` — update adjustment status (admin)
- `PUT /:id` — update adjustment (admin)
- `DELETE /:id` — delete adjustment (admin)

## Stock Relationships / Inventory Utilities (`/api/stock-relationships`)

- `GET /alerts/low-stock` — low stock alerts
- `GET /reports/comprehensive` — comprehensive stock report
- `GET /history/:productId` — stock movement history for a product
- `GET /validate/product-deletion/:productId` — validate whether a product can be deleted (admin)
- `POST /validate/order-stock` — validate stock availability for an order
- `POST /adjustments/physical-count` — physical count adjustment handling (admin)
- `POST /adjustments/damage-loss` — damage/loss adjustment handling (admin)

## Reports (`/api/reports`)

- `GET /stock` — stock report
- `GET /sales` — sales report
- `GET /stock-movements` — stock movement report
- `GET /purchase-orders` — purchase order report

(Access controlled by auth/role/permission middleware.)

## Barcodes (`/api/barcodes`)

- `POST /generate/:id` — generate barcode for a product (admin)
- `GET /image/:id` — get barcode image
- `POST /bulk-generate` — bulk generate barcodes (admin)
- `GET /search/:barcode` — search product by barcode

## Related docs

- [CONSTRAINTS.md](CONSTRAINTS.md) — domain/business constraints and validation rules
- [ARCHITECTURE.md](ARCHITECTURE.md) — backend/frontend architecture and data flow context
- [WEB_APP.md](WEB_APP.md) — how the web UI maps to these capabilities
