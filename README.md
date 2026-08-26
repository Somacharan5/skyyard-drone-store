# SkyYard — RC & Drone Hobby Store

A full e-commerce site inspired by daddydrones.in's layout, color palette
(sky-blue `#2298c6` accent, red sale badges, light-blue category tiles,
Montserrat/Roboto type), and structure: hero banner, category grid, product
carousels, testimonials, and a full checkout flow.

**"SkyYard" is a placeholder brand** — swap the name, tagline, and contact
details in `client/src/config/brand.js` for the real thing whenever it's
decided. Nothing else in the app needs to change.

## Live

- **Storefront:** https://skyyard-store.netlify.app (Netlify)
- **API:** https://skyyard-api.fly.dev (Fly.io, `sin`/Singapore region, 1GB
  persistent volume for the SQLite file)
- **Repo:** https://github.com/Somacharan5/skyyard-drone-store (private)

Frontend redeploys: `cd client && VITE_API_URL=https://skyyard-api.fly.dev/api npm run build && netlify deploy --prod --dir=dist`.
Backend redeploys: `cd server && flyctl deploy`.

## Stack

- **client/** — React 19 + Vite, React Router, plain CSS (no framework)
- **server/** — Express + SQLite (`better-sqlite3`), JWT auth, Razorpay

Product images are generated SVG illustrations (`client/src/icons/`), not
photos — no third-party product photography was used.

## Running it locally

**Terminal 1 — API server:**
```bash
cd server
npm install
cp .env.example .env   # then fill in JWT_SECRET (any random string) and, optionally, Razorpay keys
npm run seed            # populates categories + ~31 sample products
npm run dev              # http://localhost:4000
```

**Terminal 2 — storefront:**
```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:4000`, so just open
http://localhost:5173.

## Payments

Cash on Delivery works out of the box. For real online payments, get **free
test-mode keys** from the [Razorpay dashboard](https://dashboard.razorpay.com)
(Settings → API Keys) and put them in `server/.env`:

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Restart the server — the "Pay Online" option at checkout will light up
automatically (the frontend checks `/api/orders/payment-config`). Swap in
live keys the same way when you're ready to go live.

## What's included

- Home, category/shop listing with filters (category, price, brand, sort),
  product detail with specs/reviews, cart, checkout, order history
- Email/password auth (JWT), saved addresses
- Orders stored server-side; stock decrements on purchase
- Wishlist (local to the browser)
- Static pages: About, Contact (backed by a real endpoint), FAQ, Shipping & Returns

## What's still a placeholder

- Brand name/logo/contact info (`client/src/config/brand.js`)
- Product catalog is sample data (`server/src/db/seed.js`) — replace with
  real products, or wire the frontend up to a real inventory source
- No admin panel — products/orders are managed directly in the SQLite DB
  for now
