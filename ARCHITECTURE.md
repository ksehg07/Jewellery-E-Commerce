# NPJ Jewellery E-Commerce Platform Architecture

**Status:** Living architecture source of truth  
**Last reviewed:** 2026-08-22  
**Current position:** Sprint 6, before Sprint 6.1

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
    api/auth/[...all]/           Better Auth catch-all API handler
  actions/                      Server action area; currently sparse
  components/
    layout/                     Header, footer, announcement, navigation, container
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
public/images/                  Storefront category and product image assets
```

Generated Prisma files should be regenerated from `prisma/schema.prisma`; they are not the schema source of truth.

## Application Route Architecture

The `(storefront)` folder is a route group, so it does not appear in public URLs. The current implemented public routes are:

- `/` - homepage
- `/shop` - mock product listing and client-side search
- `/product/[slug]` - mock product detail and related products
- `/cart` - cart page
- `/checkout` - checkout UI
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

`/admin` routes are `PLANNED`; no admin route tree currently exists. Product and order API/server actions are also `PLANNED`.

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

Server authorization helpers provide active-user and role checks, including `requireAdmin`, but an admin route or dashboard currently does not consume them.

### Planned

- Customer account workflows and protected customer features.
- Admin route protection and dashboard authorization using the existing role/status helpers.
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

The current schema already includes PostgreSQL decimal fields for monetary values and weights, enum-backed order/payment states, uniqueness for product slugs/SKUs, variant SKUs, and the product/variant inventory relation.

### Controlled audit note

The schema is a foundation, not proof that every planned behavior is wired. It currently has product-level `metal`, `purity`, `netWeight`, `makingChargeType`, `makingChargeValue`, `stoneCharge`, and `wastagePercentage`; variants currently have `priceAdjustment` but do not carry their own weight or pricing strategy. It also does not currently contain an explicit audience field or an explicit fixed-price/pricing-strategy field. Sprint 6.1 must audit these gaps before catalogue migration. No schema changes are part of this documentation task.

## Product Architecture

### Current implementation

The visual storefront uses `MockProduct` and `MockProductVariant` from `src/features/products/data/mock-products.ts`. `/shop` passes the mock array to `ShopClient`, where search filters locally. `/product/[slug]` finds a mock product by slug and derives related products from the same array.

The Prisma product model supports the intended catalogue relationships: category, optional collection, images, variants, inventory, and order/cart references. A normalized catalogue query layer is not implemented yet; `src/services/product.service.ts` is currently empty.

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

Catalogue normalization and any necessary schema upgrade are `IN PROGRESS` in Sprint 6.1-6.2.

## Pricing Architecture

### Current implementation

The mock catalogue exposes a single numeric `price` and variant price values. The cart subtotal is calculated from those client-held numbers. There is no database-backed pricing calculator or live metal-rate integration yet.

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

Financial values must be calculated and validated on the server for checkout. Client cart prices are display state, not an authority for an order total. This is `PLANNED` and is a key part of Sprint 6.3-6.4.

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

The current customer experience is visually implemented around mock data. Dynamic Prisma-backed rendering is `PLANNED` after the product query layer is in place.

## Admin Architecture

### Current state

`/admin` and its dashboard components do not currently exist. The authorization boundary exists in server helpers, and the database has the core product, inventory, category, and order models.

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

- Transition from `mockProducts` to Prisma-backed catalogue architecture.
- Sprint 6.1 controlled product schema audit and upgrade.
- Sprint 6.2 catalogue normalization planning.

### Not yet implemented

- Product query/service layer.
- Dynamic storefront data.
- Admin dashboard and admin CRUD.
- Database/local-cart reconciliation.
- Pricing calculator and live metal-rate integration.
- Online payment integration and order processing workflow.
- Invoice generation.

## Current Sprint

**Sprint 6: Product Foundation Transition**

Immediate task: **Sprint 6.1 - Controlled Product Schema Audit and Upgrade**.

The audit must compare the actual schema with normalized catalogue, audience, variant, and pricing requirements. It must patch only necessary gaps and preserve the existing foundation.

## Planned Next Steps

1. **Sprint 6.1:** Audit and, if justified, minimally upgrade the product schema.
2. **Sprint 6.2:** Normalize the client's raw catalogue into internal product, audience, material, category, and variant data.
3. **Sprint 6.3:** Implement the Prisma-backed product query/service layer and validation boundary.
4. **Sprint 6.4:** Replace mock storefront reads with dynamic product queries and server-authoritative pricing.
5. **Sprint 7:** Build the premium admin dashboard against the shared product, inventory, order, and pricing system.

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

## Known Technical Considerations

- Product pages and shop pages currently use mock data, so the storefront is not yet a database-backed catalogue.
- `product.service.ts` and `order.service.ts` are empty boundaries; business logic should be added there or in clearly owned server actions/services rather than scattered through UI components.
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
