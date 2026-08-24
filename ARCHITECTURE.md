# NPJ Jewellery E-Commerce Platform Architecture

**Status:** Living architecture source of truth  
**Last reviewed:** 2026-08-23
**Current position:** Sprint 7 foundation plus account route foundation

This document describes the architecture that exists in the repository today. Future work is explicitly labeled `PLANNED` and must not be read as implemented behavior.

## Project Overview

NPJ is a full-stack jewellery and silverware e-commerce platform for a local jewellery business. It has two intended interfaces:

- **Customer storefront:** product discovery, product details, cart, checkout, and informational pages.
- **Admin dashboard:** product, category, inventory, and order management using the same backend and database.

The storefront is substantially complete as a visual and interaction foundation, but its product data is still mock data. The repository is transitioning to Prisma-backed product queries.

## Goals and Development Philosophy

The working balance is:

- Fast delivery for the current MVP.
- A clean foundation that can be extended without a rewrite.
- Approximately 50-60% future scalability, without premature enterprise abstractions.
- Premium visual quality under the Modern Luxury direction: ivory, gold, charcoal, elegant serif display type, and modern sans UI text.

MVP scope is intentionally limited, but it is not a reason to reduce usability or finish quality.

## Current Technology Stack

### Implemented

- Next.js `16.3.0` App Router
- React `19.2.8`
- TypeScript `5`
- Tailwind CSS `4` with `@tailwindcss/postcss`
- shadcn/ui primitives, Radix UI, and Lucide React
- Prisma `7.9.1` with the generated client in `src/generated/prisma`
- PostgreSQL, configured for Neon through `DATABASE_URL`
- `@prisma/adapter-pg` and `pg`
- Better Auth `1.6.26` with Prisma adapter
- Email OTP through Better Auth's email OTP plugin
- Resend for OTP email delivery
- Zustand `5.0.15` with `persist` middleware and browser `localStorage` cart persistence
- Zod, React Hook Form, and date-fns are available for validation/forms/utilities

### Development commands

- `npm run dev`: development server
- `npm run build`: production build
- `npm run start`: production server
- `npm run lint`: ESLint

## Repository Structure

```text
prisma/
  schema.prisma                 Prisma source schema
  migrations/                   PostgreSQL migration history
src/
  app/                          App Router layouts, pages, and API routes
    (storefront)/               Shared customer storefront route group
    (admin)/admin/              Protected admin route group and dashboard
    api/auth/[...all]/           Better Auth catch-all API handler
  actions/                      Server action area; currently sparse
  components/
    layout/                     Header, global search, footer, announcement, navigation, container
    admin/                      Protected dashboard shell, sidebar, and header
    storefront/                 Home, shop, product, cart, and checkout UI
    ui/                         Reusable UI primitives
  config/                       Site configuration
  constants/                    Metadata, roles, theme, and route constants
  features/
    cart/                       Zustand cart store and cart types
    products/data/              Current mock product catalogue
  generated/prisma/             Generated Prisma client and model types
  hooks/                        Shared React hooks area
  lib/
    auth/                       Better Auth, session, authorization, OTP/password helpers
    email/                      Resend transport and email templates
    prisma/                     Server-only Prisma client
    validations/                Zod validation area
  services/                     Service-layer boundaries; product/order services are currently empty
  styles/                       Shared styles area
  types/                        Shared domain types
scripts/
  promote-admin.ts              Operator-only first-admin promotion script
public/images/                  Storefront category and product image assets
```

Generated Prisma files should be regenerated from `prisma/schema.prisma`; they are not the schema source of truth.

## Application Route Architecture

The `(storefront)` folder is a route group, so it does not appear in public URLs. The current implemented public routes are:

- `/` - homepage
- `/shop` - Prisma-backed product listing, optional category filtering, and URL-driven client-side search
- `/product/[slug]` - mock product detail and related products
- `/cart` - cart page
- `/checkout` - checkout UI
- `/account` - session-aware customer account foundation
- `/collections` - collections page
- `/arrivals` - new arrivals page
- `/about` - about page
- `/contact` - contact page
- `/shipping` - shipping information
- `/returns` - returns information
- `/privacy-policy` - privacy policy
- `/terms` - terms
- Unmatched routes use `src/app/not-found.tsx`.

Implemented API route:

- `/api/auth/[...all]` - GET and POST are forwarded to Better Auth via `toNextJsHandler`.

The protected `/admin` route is implemented under the `(admin)` organizational route group. Its layout performs server-side authorization before rendering child pages. Product and order API/server actions remain `PLANNED`.

## Authentication Architecture

### Implemented

Better Auth is configured in `src/lib/auth/auth.ts` with the Prisma adapter and PostgreSQL provider. The server-side session helper in `src/lib/auth/session.ts` reads request headers and calls `auth.api.getSession`. The browser client is created in `src/lib/auth/auth-client.ts` with the email OTP client plugin.

The Better Auth route handler is the catch-all App Router route at `/api/auth/[...all]`.

The user model supports:

- `CUSTOMER` and `ADMIN` roles
- `ACTIVE`, `INACTIVE`, and `BLOCKED` statuses
- Optional first name, last name, and phone
- Email and phone verification flags
- Last login timestamp

The authentication configuration enables in-memory rate limiting. Email OTPs are six digits, expire after 300 seconds, and allow three attempts. Sending verification OTPs is limited to three requests per 60-second window. OTP email delivery uses Resend.

Server authorization helpers provide active-user and role checks. The admin layout uses `src/lib/auth/require-admin.ts`, which reads the Better Auth session, verifies the corresponding Prisma user is `ACTIVE` and has the `ADMIN` role, and redirects unauthorized requests to `/`.

There is currently no login route in the repository. The account page therefore renders a truthful unavailable-authentication state when no session is present, while authenticated sessions can view session-provided profile identity and sign out.

### Planned

- Customer account workflows and protected customer features.
- Review of rate-limit storage before production scaling; current storage is process memory.

## Database Architecture

Prisma uses the PostgreSQL provider and reads `DATABASE_URL` through `prisma.config.ts`. The runtime client uses `PrismaPg` and a development-safe global singleton in `src/lib/prisma/client.ts`. Migration files live under `prisma/migrations`.

Current schema domains:

- **Identity:** `User`, `Account`, `Session`, `Verification`
- **Addresses:** `Address`
- **Catalogue:** `Category` with a self-referencing parent/children tree, `Collection`, `Product`, `ProductImage`, `ProductVariant`
- **Pricing inputs:** `MetalRate`
- **Stock:** `Inventory`
- **Commerce:** `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `Coupon`
- **Engagement/content:** `Review`, `Banner`, `Newsletter`, `StoreSettings`

Important relationships include users to addresses, carts, orders, reviews, accounts, and sessions; products to categories, optional collections, images, variants, inventory, cart items, order items, and reviews; and orders to historical order items, one address, and an optional one-to-one payment.

The current schema already includes PostgreSQL decimal fields for monetary values and weights, enum-backed order/payment states, uniqueness for product slugs/SKUs, variant SKUs, and the product/variant inventory relation. Sprint 6.1 has added explicit audience and pricing fields to `Product`, plus variant-level weight and pricing fields.

### Controlled audit note

The schema is a foundation, not proof that every planned behavior is wired. It currently has product-level `metal`, `purity`, `netWeight`, `makingChargeType`, `makingChargeValue`, `stoneCharge`, and `wastagePercentage`; variants currently have `priceAdjustment` but do not carry their own weight or pricing strategy. It also does not currently contain an explicit audience field or an explicit fixed-price/pricing-strategy field. Sprint 6.1 must audit these gaps before catalogue migration. No schema changes are part of this documentation task.

## Product Architecture

### Current implementation

The visual storefront now consumes `StorefrontProduct` from `src/features/products/types/product.ts`. Server-only query functions in `src/features/products/queries/` fetch active Prisma products, and `src/features/products/utils/product-mappers.ts` converts Decimal values, dates, images, variants, category data, and inventory into serializable storefront data. `/shop` still performs search locally in `ShopClient`, but its input is now server-fetched.

The Prisma product model supports the intended catalogue relationships: category, optional collection, images, variants, inventory, and order/cart references. The older `src/services/product.service.ts` boundary remains empty; product reads are owned by the feature query layer for Sprint 6.3.

### Target model

The normalized product concept is:

```text
Product
|- Category
|- Audience: WOMEN | MEN | KIDS | GENERAL
|- Material: GOLD | SILVER | future materials
`- Variants
```

Audience should be data, not duplicated in category names. For example, `Ring + WOMEN + GOLD` is preferred to a separate `Women's Ring` category. The final model must support jewellery and silverware, including products such as silver diyas, glasses, spoons, bowls, and toys.

Catalogue normalization is complete enough for the current product query contract; further raw catalogue import remains dependent on the catalogue data source.

## Pricing Architecture

### Current implementation

The storefront mapper exposes `Product.fixedPrice` as its display price. Metal-based products without a stored fixed display price expose `null` and render “Price on request”; no live price is fabricated. Fixed-price variant prices use variant fixed price when present, otherwise product fixed price plus `priceAdjustment`. The cart subtotal is still calculated from client-held values.

The Prisma schema stores some required inputs for metal-rate pricing and has a `MetalRate` table keyed uniquely by metal and purity. `ProductVariant.priceAdjustment` exists, but a complete product/variant pricing contract is not implemented.

### Planned pricing contract

The system must support both:

1. **Fixed price:** appropriate for many silverware and fixed-price products.
2. **Metal-rate based:**

   ```text
   live metal rate * applicable weight
   + making charges
   + additional/stone charges
   + applicable tax
   = final selling price
   ```

Pricing strategy, fixed price, material/metal, purity, weight, making charge type/value, additional charges, stone charges, and tax must be represented at the correct product or variant level. Variant differences such as size, weight, SKU, price, pricing strategy, and inventory must be supported.

Financial values must be calculated and validated on the server for checkout. Client cart prices are display state, not an authority for an order total. This remains `PLANNED` for the payment/order phase.

## Cart and State Management

### Implemented

`src/features/cart/store.ts` defines a Zustand store wrapped with `persist` and uses the storage key `npj-cart`. It stores cart items in browser persistence and supports add, remove, quantity update, clear, item count, and subtotal operations. `CartItem` includes product/variant identifiers, display data, price, and quantity.

The cart is currently a client-side storefront cart. The Prisma `Cart` and `CartItem` models exist for a future persisted/user-linked cart, but synchronization between local storage and database cart data is not implemented.

### Hydration rule

Persisted Zustand state must be read only after safe client hydration. Future components must follow the existing hydration-safe pattern when one is established in the storefront. Do not render persisted browser state as server-rendered initial state, disable SSR globally, or use `suppressHydrationWarning` as a shortcut.

### Planned

- Reconcile guest local cart with a customer cart after authentication.
- Validate product, variant, availability, and server-calculated price at checkout.
- Decide whether the database cart becomes authoritative for signed-in users.

## Storefront Architecture

The root layout loads the Cormorant Garamond display font and Manrope UI/body font, global styles, and document metadata. The storefront layout composes the announcement bar, header, main content, and footer.

Storefront UI is organized by concern:

- `components/storefront/home`: hero, categories, featured products, promotion, trust section, newsletter.
- `components/storefront/shop`: toolbar, search, grid, empty state, header.
- `components/storefront/product`: gallery, information, details, related products.
- `components/storefront/cart`: cart items, sheet, trigger.
- `components/storefront/checkout`: checkout form and order summary.

The homepage featured section, shop, product detail, collections, and new arrivals now use dynamic Prisma-backed queries while preserving the existing UI. The shared header provides an expandable client search that navigates to `/shop?q=<query>`. Homepage category cards use catalogue slugs for their `/shop?category=<slug>` links, and the shop query applies category filtering server-side before the existing client-side URL search. The mock data file remains in place for transition safety and should only be removed after all references are intentionally retired.

## Admin Architecture

### Current state

The `/admin` route group now contains a protected layout and dashboard page. `src/components/admin/admin-shell.tsx` composes the desktop sidebar, header, and content area. `admin-sidebar.tsx` provides desktop navigation and a mobile Sheet drawer. `admin-header.tsx` displays the authenticated admin identity and uses the existing Better Auth client for sign-out.

The current dashboard scope is intentionally limited to real database metrics: total products, total orders, low-stock inventory rows, total customers, and the five most recent orders. No CRUD workflows or future admin routes are implemented.

The first administrator can be established by an operator with `npm run bootstrap:admin -- <existing-user-email>`. The server-side script looks up the existing user by email and updates only `role` to `ADMIN` and `status` to `ACTIVE`; it is not exposed as an HTTP route.

The customer account route is a session-aware UI foundation at `/account`. It displays only identity supplied by the Better Auth session, provides sign-out for authenticated users, and shows a truthful unavailable-authentication state when no session is present. Customer order history and profile editing are not implemented.

### Planned MVP

```text
/admin
|- Overview: total products, active products, low stock, recent orders
|- Products: list, search, create, edit, delete, enable/disable, variants
|- Categories: basic management
`- Orders: basic management
```

Admin forms must eventually cover basic information, category, audience, material, fixed and metal-rate pricing, variants, inventory, images, and status. Admin CRUD and the customer storefront must use the same product database and pricing rules.

## Payment Architecture

### Current state

The Prisma schema contains `Payment` with gateway identifiers, amount, status, paid time, and a one-to-one relation to `Order`. No payment gateway integration or payment API route is implemented. Cash on Delivery is intentionally excluded from the product direction.

### Planned

Only online payment will be supported. The initial implementation will select one gateway from Razorpay, PayU, or Cashfree. Gateway secrets belong in environment variables and must never be stored in Prisma schema or source code. Payment creation, callback/webhook verification, idempotency, and order state transitions must be server-controlled.

## External Services / Environment Variables

Observed environment-backed integrations:

- `DATABASE_URL`: PostgreSQL/Neon connection string used by Prisma config and the runtime Prisma adapter.
- `RESEND_API_KEY`: Resend API key used by the email transport.
- `EMAIL_FROM`: sender address used for OTP email.

Environment files and secrets are not architecture data and must remain outside source control. A metal-rate provider and payment provider are not finalized and therefore have no implemented environment contract yet.

## Current Development Status

### Completed / IMPLEMENTED

- Project foundation and database migrations.
- Prisma PostgreSQL foundation and generated client.
- Better Auth foundation with Prisma adapter.
- Email OTP foundation and Resend email transport.
- User role/status and authorization groundwork.
- Premium static storefront shell and visual system.
- Homepage, shop, product detail, cart, checkout UI, collections, new arrivals, and informational pages.
- Mock product catalogue and local Zustand cart persistence.
- 404 handling.

### IN PROGRESS

- Catalogue migration from `mockProducts` to Prisma-backed reads.
- Sprint 6.2 catalogue normalization/loading for the real catalogue.
- Server-authoritative pricing and checkout validation.

### Completed in this position

- Sprint 6.3 product query layer, mapper, serializable storefront types, and query helpers.
- Sprint 6.4 dynamic storefront integration for shop, product detail, featured products, collections, and new arrivals.

### PLANNED / Not yet implemented

- Admin CRUD and future admin workflows.
- Database/local-cart reconciliation.
- Pricing calculator and live metal-rate integration.
- Online payment integration and order processing workflow.
- Invoice generation.

## Current Sprint

**Sprint 7: Admin Foundation**

Completed in this position: **Sprint 6.1 - Controlled Product Schema Audit and Upgrade**, **Sprint 6.3 - Product Data Layer**, **Sprint 6.4 - Dynamic Storefront**, **Sprint 7.1 - Admin Access & Route Protection**, and **Sprint 7.2 - Admin Dashboard Shell**.

The current admin foundation is limited to protected `/admin` access, a responsive shell, and real read-only overview metrics.

## Planned Next Steps

1. **Sprint 6.2:** Complete normalization/loading of the client's raw catalogue into internal product, audience, material, category, and variant data.
2. Add server-authoritative pricing and checkout validation when the order/payment phase begins.
3. Add admin product, category, inventory, and order workflows only in their dedicated future sprints.

Each step that changes architecture, routes, models, state, integrations, or sprint status must update this document in the same task.

## Post-Delivery Hotlist

### HOTLIST: Invoice system

Target: approximately one week after initial delivery.

The intended flow is:

```text
Order
-> historical OrderItem snapshots
-> payment / confirmation
-> invoice generation
-> PDF or downloadable invoice
```

Invoice data must be based on immutable order snapshots so later product price, metadata, or catalogue changes cannot alter historical invoices. The existing `OrderItem` already stores product name, SKU, metal, purity, weight, charges, tax, price, and quantity, but invoice generation and delivery are not implemented.

## Architectural Decision Log

### 2026-08-22 / Sprint 6: Prisma as the shared commerce foundation

**Decision:** Use Prisma with PostgreSQL/Neon as the shared persistence layer for storefront and future admin interfaces.

**Reason:** The platform needs one source for products, variants, inventory, orders, pricing inputs, and authentication data while retaining a fast MVP path.

**Impact:** Product reads, admin CRUD, pricing, inventory, and order workflows must converge on the Prisma models and server-side services.

**Status:** Current; product migration is in progress.

### 2026-08-22 / Sprint 6: Normalize catalogue dimensions

**Decision:** Keep category, audience, and material as separate product dimensions; do not duplicate audience in category names.

**Reason:** The same category must support multiple audiences and materials without catalogue duplication.

**Impact:** Catalogue import, product forms, filters, schema audit, and storefront queries must preserve these dimensions.

**Status:** Planned.

### 2026-08-22 / Sprint 6: Support fixed and metal-rate pricing

**Decision:** The product architecture must support both fixed-price and metal-rate-based selling prices, with pricing data at the appropriate product or variant level.

**Reason:** Jewellery and silverware have different pricing needs, and metal-rate calculations must remain accurate enough to avoid financial loss.

**Impact:** Schema audit, pricing service, metal-rate storage/cache, checkout validation, admin forms, and order snapshots.

**Status:** Planned.

### 2026-08-22 / Foundation: Better Auth with email OTP

**Decision:** Use Better Auth with the Prisma adapter and email OTP as the authentication foundation.

**Reason:** It provides the required session/account/verification persistence while fitting the existing PostgreSQL foundation and passwordless MVP flow.

**Impact:** User, Account, Session, and Verification models; auth API route; OTP email delivery; role/status authorization helpers.

**Status:** Current.

### 2026-08-22 / Foundation: Persist guest cart locally

**Decision:** Use Zustand persist with the `npj-cart` local storage key for the current storefront cart.

**Reason:** It provides a fast guest-cart MVP without requiring account state for basic shopping interactions.

**Impact:** Client cart components, hydration handling, future sign-in cart reconciliation, and checkout validation.

**Status:** Current; database cart synchronization planned.

### 2026-08-22 / Commerce: Online payments only

**Decision:** Exclude Cash on Delivery and implement one online payment gateway initially.

**Reason:** The intended checkout must use verified online payment while keeping the first integration focused.

**Impact:** Payment service, webhook/callback routes, order status transitions, environment variables, and checkout UI.

**Status:** Planned; gateway selection pending.

### 2026-08-23 / Sprint 6.3-6.4: Centralized storefront product mapping

**Decision:** Keep Prisma access in server-only feature queries and pass a mapped `StorefrontProduct` shape to the existing storefront components.

**Reason:** This replaces mock reads without exposing Prisma Decimal values or database relations to React components, and avoids redesigning the current storefront.

**Impact:** Product queries, serialization, product cards, product detail, featured products, collections, arrivals, and the remaining mock-data transition.

**Status:** Current.

## Known Technical Considerations

- `product.service.ts` and `order.service.ts` are empty boundaries; product reads currently live in `src/features/products/queries/`, while order logic remains unimplemented.
- The mock product file remains in the repository, but active storefront page references have been replaced by dynamic queries.
- Client cart prices are mutable browser state and cannot be trusted for final order totals.
- Decimal monetary and weight values must preserve precision across Prisma, pricing calculations, serialization, and UI formatting.
- Variant-level weight and pricing strategy are not fully represented by the current schema; resolve this during the controlled audit rather than adding ad hoc fields during catalogue import.
- The schema currently has no explicit audience model/field despite that being part of the target product concept.
- Better Auth rate limiting currently uses process memory, which is suitable for development but has limits across multiple instances.
- The external metal-rate provider is not selected. Do not fetch it on every product page request; use a validated normalization and database/cache boundary.
- Payment callbacks/webhooks must be verified server-side and made idempotent before orders are treated as paid.
- Historical order and invoice values must be snapshots, not live joins to mutable product data.
- Authentication, admin authorization, pricing, inventory checks, and payment state transitions are server responsibilities.
- Any future change to routes, schema, auth, state, integrations, or sprint status must update this living document in the same task.
