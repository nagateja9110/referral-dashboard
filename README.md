# Go Business — Referral Dashboard

A React + Vite referral management dashboard with authentication, an overview/service-summary view, a searchable/sortable/paginated referrals table, referral link/code sharing, and a referral detail page.

## Tech Stack

- React 19 + Vite
- react-router-dom (BrowserRouter in `App.jsx`)
- js-cookie (JWT stored in a `jwt_token` cookie)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` (or the next free port).

To build for production:

```bash
npm run build
npm run preview
```

## Test Credentials

```
Email:    admin@example.com
Password: admin123
```

## API

All data comes from:

```
https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin   (POST, login)
https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals    (GET, Bearer token required)
```

The referrals endpoint accepts `search` (or `q`), `sort` (`asc`/`desc`), and `id` query params. Pagination (10 rows/page) is handled entirely client-side.

## Routes

| Route | Access |
|---|---|
| `/login` | Public (redirects to `/` if already authenticated) |
| `/` | Protected — Referral Dashboard |
| `/referral/:id` | Protected — Referral Details |
| `/dashboard/referrals` | Protected — redirects to `/` |
| `*` | Public — 404 Not Found |

## Project Structure

```
src/
  api.js              API request helpers
  format.js           Date/currency formatting helpers
  App.jsx             Routes (wrapped in BrowserRouter)
  main.jsx            Entry point (renders <App /> only)
  components/
    ProtectedRoute.jsx
    Navbar.jsx
    Footer.jsx
  pages/
    Login.jsx
    Dashboard.jsx
    ReferralDetail.jsx
    NotFound.jsx
```
