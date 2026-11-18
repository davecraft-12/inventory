# Inventory Management Web App

A full-stack inventory management system with a React (Vite) web frontend and a Node.js/Express + MongoDB backend.

## Project structure

- `frontend/` — React web app (Vite, React Router, Tailwind utilities/components)
- `server/` — Express API server, Mongoose models, auth, inventory/business routes
- `server/scripts/api/` — standalone Node scripts that call the backend API (debug/maintenance)
- `server/scripts/db/` — standalone Node scripts that connect directly to MongoDB (checks, fixes, image updates, seed, tests)
- `server/public/` — standalone server-served static pages (e.g. supplier portal)
- `docs/` — project documentation (constraints, guides, reference files)

## Prerequisites

- Node.js 18+ (recommended; scripts use global `fetch`)
- npm
- MongoDB instance (local or remote)

## Backend setup (`server/`)

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create `server/.env` (not committed) with at least:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/inventory
   ACCESS_TOKEN_SECRET=your-access-secret
   REFRESH_TOKEN_SECRET=your-refresh-secret
   # Optional compatibility fallback used by some auth code:
   # JWT_SECRET=your-jwt-secret
   ```
3. Start the API server:
   ```bash
   npm start
   ```
   - Runs `nodemon --env-file=.env index.js`
   - Default URL: `http://localhost:3000`
   - On startup the server connects to MongoDB and ensures default users exist (if missing)

### Default seeded users (development)

Created automatically by `server/index.js` when not present:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@inventory.com` | `admin123` |
| Manager | `manager@inventory.com` | `manager123` |
| Viewer | `viewer@inventory.com` | `viewer123` |
| Customer (internal) | `staff@inventory.com` | `staff123` |
| Customer (external) | `customer@example.com` | `customer123` |

> Change/remove these for any non-development environment.

## Frontend setup (`frontend/`)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   - Vite dev server: `http://localhost:5173`
   - `/api` requests are proxied to `http://localhost:3000` (see `frontend/vite.config.js`)
3. Production build / lint:
   ```bash
   npm run build
   npm run lint
   npm run preview
   ```

## Web app areas

- **Auth:** `/login`
- **Admin dashboard:** `/admin-dashboard` (products, categories, suppliers, orders, purchase orders, stock adjustments, reports, users, etc.)
- **Manager dashboard:** `/manager-dashboard` (stock in/products, stock out/sales orders, stock adjustments, physical count, low stock, purchase orders, reports, profile)
- **Customer area:** `/customer` (catalog, cart, orders, profile)

Available pages and actions depend on the authenticated user's role.

## Backend utility scripts

### API scripts (`server/scripts/api/`)

These scripts call the running backend API (start the backend first):

```bash
node server/scripts/api/check-stock.js
node server/scripts/api/check-supplier-pos.js
node server/scripts/api/debug-auth.js
node server/scripts/api/test-stock-adjustments.js
node server/scripts/api/delete-cancelled-po.js
```

### Database scripts (`server/scripts/db/`)

These scripts connect directly to MongoDB (use `server/.env` / `MONGO_URI` as applicable) and are organized by purpose:

- `checks/` — read/verify database state (e.g. `check-bicycle.js`, `verify-all-stock.js`)
- `fixes/` — one-off data correction scripts (e.g. `fix-stock-sync.js`)
- `images/` — product image update scripts (e.g. `addProductImages.js`, `updateProductImages.js`)
- `seed/` — seed script (`seed.js`)
- `tests/` — ad-hoc test/helper scripts (e.g. `test-manager.js`)

Optional environment variables:

- `API_URL` — backend base URL (default: `http://localhost:3000`)
- `ADMIN_EMAIL` — login email used by the script (default: `admin@gmail.com` in scripts; override to match your user)
- `ADMIN_PASSWORD` — login password used by the script

> `delete-cancelled-po.js` performs a destructive action (deletes the first cancelled purchase order found). Use with caution.

## Documentation

- `docs/SETUP.md` — local setup, environment variables, run/build instructions, and utility scripts
- `docs/ARCHITECTURE.md` — system architecture, repository structure, and key workflows
- `docs/WEB_APP.md` — web app areas, routes, and role-based pages/features
- `docs/API.md` — backend API overview (route modules and endpoints summary)
- `docs/CONSTRAINTS.md` — product/category/supplier/PO/stock-adjustment relationships and validation constraints
- `frontend/README.md` — frontend-specific development notes


## Supplier portal

- A standalone supplier portal page is available at `server/public/supplier-portal.html`.
- When the backend server is running, it is served at `GET /supplier-portal` (e.g. `http://localhost:3000/supplier-portal`).
