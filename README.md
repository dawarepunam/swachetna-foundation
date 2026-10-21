# Swachetna Foundation — frontend demo

An editorial-style, responsive storefront prototype for Swachetna Foundation. The project is frontend-only and uses local sample data. Cart, wishlist, sample accounts, newsletter signups and demo orders run in the current browser; no real order, payment, email, authentication or delivery service is connected.

## Stack

- Next.js 16 App Router, React 19, TypeScript (strict mode)
- CSS Modules for component and page styling; global CSS is limited to tokens, reset and base styles
- Lucide React icons
- Local SVG artwork rendered in the product artwork component; no remote image dependency
- LocalStorage for demo cart, wishlist, account, newsletter and order data

## Requirements and setup

Use Node.js 20.9 or newer and npm. From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production commands:

```bash
npm run build
npm run start
npm run lint
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial home, categories, featured products, foundation purpose, newsletter demo |
| `/shop` | Product catalog with search, category and price filters, sort and load-more |
| `/categories` and `/categories/[slug]` | Browse sample product collections |
| `/products/[slug]` | Product description, sample stock, quantity, wishlist and add-to-cart |
| `/search` | Search the local catalog |
| `/cart`, `/wishlist` | Persistent demo shopping bag and saved products |
| `/checkout`, `/order-confirmation` | Validated demo checkout and local demo reference; no payment |
| `/about`, `/contact`, `/faq`, `/policies` | Foundation story, demo contact form, FAQs and prototype disclosures |
| `/account/login`, `/account/register`, `/account/forgot-password` | Simulated account screens; no real authentication or email |
| `/account/profile`, `/account/orders`, `/account/addresses` | Local sample account screens |
| `/track-order` | Looks up demo references saved in this browser only |

## Structure

```text
src/
├── app/           # App Router pages, route-level CSS Modules and global CSS
├── components/    # home, layout, product, account and reusable UI components
├── context/       # shared cart and wishlist state
├── data/          # sample products and collection metadata
├── styles/        # brand tokens: colors, type, spacing and layout
└── types/         # TypeScript product and badge definitions
```

Product data lives in `src/data/products.ts`. Update that file to change sample inventory. `StoreProvider` restores local cart and wishlist state after hydration, so the server and first client render begin with the same empty state and avoid LocalStorage hydration mismatches. Values are then loaded and saved in LocalStorage under `swachetna-store-v1`. Demo account, orders and newsletter entries use separate keys; clearing this site's browser storage removes them.

## Admin workspace

The admin interface is available at `/admin/login`; its workspace routes are `/admin/dashboard`, `/admin/products`, `/admin/inventory`, `/admin/orders`, `/admin/customers`, `/admin/categories`, `/admin/reports`, `/admin/content`, `/admin/campaigns` and `/admin/settings`. The sidebar collapses on desktop and opens as a dismissible drawer on small screens (menu button, close button, backdrop, navigation link or Escape key).

The workspace is frontend-only. Catalog and category views start from `src/data/products.ts`; admin product edits, stock changes, categories, campaigns, content and settings persist in the current browser under `swachetna-admin-workspace-v1`. Dashboard overview uses a clearly marked sample order preview when no local orders exist, so the charts and sections are easier to understand. These preview values are not saved as orders and are not real sales. Orders, customers and reports continue to show only records available in the browser (including locally recorded storefront checkouts where present). Inventory supports text, collection and stock filters, sorting, clear filters, stock adjustments and CSV export. Products can be created, edited and removed; orders can be filtered, exported and have their status changed; campaign and content/settings forms save locally.

Local admin catalog edits are not published to the storefront, and workspace changes do not sync between browsers or devices. The sign-in screen is only a visual entry point: it does not authenticate users, protect routes or connect to a server. Do not use it as production access control. A backend and server-side authentication are required for shared, authoritative inventory, customer and order data.

## Demo limits

Product names, prices, stock and descriptions are sample storefront content. Shipping is an illustrative estimate. Checkout validates required fields, email, Indian mobile number and PIN code, then stores a clearly marked demo order locally. It does not collect card information, send email, create a real order, or track a shipment. Contact and newsletter forms show local feedback only. Privacy, terms, shipping and returns copy describes this prototype and is not a live business policy. Impact copy is illustrative; no achievements, partners or measured outcomes are claimed.

## Connecting a future backend

Keep this UI and its typed product boundaries, then add a server-side data layer for catalog and inventory. A future Strapi integration can replace `src/data/products.ts` with server-side reads from a configured CMS API, map CMS responses into `Product`, and keep secrets in server-only environment variables. Add authenticated server actions or route handlers for accounts, orders and addresses; validate inputs on the server and store order state in a database. Do not send payment credentials to this frontend. Any production checkout should use a separately reviewed payment-provider flow and replace the demo disclosures only after real business policies and integrations exist. No Strapi or backend is included here.
