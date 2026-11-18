# Frontend (Web App)

React + Vite frontend for the Inventory Management web app.

For full project setup (backend, database, default users, utility scripts), see the root [`README.md`](../README.md).

## Requirements

- Node.js 18+
- Backend API running (default: `http://localhost:3000`)

## Development

```bash
npm install
npm run dev
```

- Dev server: `http://localhost:5173`
- API proxy: requests to `/api/*` are forwarded to `http://localhost:3000` (configured in `vite.config.js`)

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Structure notes

- `src/pages/` — route-level pages grouped by area (`admin`, `manager`, `shared`, `auth`, `customer`, `inventory`)
- `src/layouts/` — dashboard/customer layouts
- `src/routes/` — root/protected route components
- `src/api/` — API modules
- `src/utils/apiWrapper.js` — shared request/auth wrapper for API calls
- `src/components/` — shared UI, layout, and dashboard components

## Manager dashboard pages

Includes Stock In/Products, Stock Out (sales orders), Stock Adjustments, Physical Count, Low Stock, Purchase Orders, Reports, and Profile (subject to backend data/permissions).
