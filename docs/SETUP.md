# Setup Guide

This guide covers local setup for the Inventory Management web app (frontend + backend).

## Prerequisites

- **Node.js 18+** (recommended)
- **npm**
- **MongoDB** (local installation or a remote MongoDB URI)
- Git (optional, for cloning/version control)

## Repository layout

- `frontend/` — React + Vite web client
- `server/` — Express API server (MongoDB/Mongoose)
- `server/scripts/` — standalone API/maintenance scripts
- `docs/` — project documentation

## 1) Backend setup

```bash
cd server
npm install
```

Create `server/.env` (this file is gitignored). Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/inventory

# JWT/auth secrets (configure strong values)
ACCESS_TOKEN_SECRET=change-me-access-secret
REFRESH_TOKEN_SECRET=change-me-refresh-secret

# Optional compatibility fallback used by some auth code
# JWT_SECRET=change-me-jwt-secret
```

Start the backend:

```bash
npm start
```

- Runs: `nodemon --env-file=.env index.js`
- Default API URL: `http://localhost:3000`
- Health/root endpoint: `GET /` → "Welcome to the API!"
- On startup, the server connects to MongoDB and ensures default users exist (development convenience).

### Default seeded users (development)

If missing, the backend creates these users on startup:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@inventory.com` | `admin123` |
| Manager | `manager@inventory.com` | `manager123` |
| Viewer | `viewer@inventory.com` | `viewer123` |
| Customer (internal) | `staff@inventory.com` | `staff123` |
| Customer (external) | `customer@example.com` | `customer123` |

> Use only for local development. Change or remove seeded credentials before any shared/non-dev deployment.

## 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

- Vite dev server: `http://localhost:5173`
- API proxy: requests to `/api/*` are forwarded to `http://localhost:3000` (see `frontend/vite.config.js`)
- Ensure the backend is running for API-backed pages/actions

### Frontend build & checks

```bash
npm run build   # production build to dist/
npm run preview # preview production build
npm run lint    # eslint
```

## 3) Running both services locally

1. Start MongoDB
2. Start backend in `server/` (`npm start`)
3. Start frontend in `frontend/` (`npm run dev`)
4. Open `http://localhost:5173`

## 4) Supplier portal (standalone page)

- File: `server/public/supplier-portal.html`
- Served by backend: `GET /supplier-portal` (e.g. `http://localhost:3000/supplier-portal`)
- The page calls backend APIs directly (configured for `http://localhost:3000/api` in the HTML) and is intended for supplier-side PO confirmation/shipping flows exposed by the API.

## 5) Backend utility scripts

Standalone scripts in `server/scripts/` call the running backend API (not part of frontend runtime):

```bash
node server/scripts/check-stock.js
node server/scripts/check-supplier-pos.js
node server/scripts/debug-auth.js
node server/scripts/test-stock-adjustments.js
node server/scripts/delete-cancelled-po.js
```

Optional environment variables:

- `API_URL` — backend base URL (default: `http://localhost:3000`)
- `ADMIN_EMAIL` — login email used by script (script default may differ from seeded users; override as needed)
- `ADMIN_PASSWORD` — login password used by script

> `delete-cancelled-po.js` performs a destructive action (deletes the first cancelled purchase order found). Use with caution.

## Notes

- Do not commit secrets (`server/.env` is ignored).
- API access and UI routes are role-dependent (admin/manager/viewer/customer).
- For domain rules and constraints, see [CONSTRAINTS.md](CONSTRAINTS.md).
