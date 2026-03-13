# Glory Commerce Platform - Phase 2 Implementation Plan

## 1) Phase Goal
Deliver a production-ready MVP for Glory and multi-merchant operations on top of the current scaffold, with core revenue flows working end-to-end:
- Product discovery -> checkout -> payment -> order lifecycle
- Merchant onboarding -> approval -> storefront -> payouts
- Admin governance -> commissions -> plans -> compliance
- AI-assisted shopping (v1 practical scope)

## 2) Scope for Phase 2 (In)
### Commerce Core
- Product catalog with category/subcategory, variant attributes, SKU, inventory adjustments.
- Product listing, product detail, cart, checkout, order confirmation.
- Coupon and discount engine (percentage/fixed, validity window, usage cap).
- Loyalty points accrual and redemption cap per order.

### Payments and Settlement
- SSLCommerz live/sandbox integration with callback/webhook verification.
- COD, advance payment, EMI as configurable payment methods.
- Merchant-level payment attribution and bi-weekly payout ledger.

### Multi-Tenant and Merchant SaaS
- Tenant resolution by subdomain and custom domain mapping.
- Merchant application flow with KYC uploads (NID, TIN, trade license).
- Admin approval/rejection workflow and status transitions.
- Merchant plans: trial/basic/pro/enterprise with feature gating.
- Staff invitations and role-based access under merchant accounts.

### Admin and Merchant Panels
- Admin dashboard: merchant approvals, commission rules, coupons, ad slots, payout queue.
- Merchant dashboard: product/inventory management, orders, coupons, ad requests, staff.

### AI Features (Operational v1)
- AI visual search endpoint: image/text input, vector retrieval from product embeddings.
- AI sales assistant endpoint: inventory-aware FAQ and sales nudges with policy limits.
- AI try-on endpoint: request orchestration and transient image handling (no persistent storage).

### Compliance and Policy
- Terms, privacy, refund, merchant agreement, acceptable use pages.
- Mandatory legal acceptance for merchants with versioned timestamp audit.

## 3) Scope for Phase 2 (Out)
- Full global expansion localization (multi-currency, multilingual legal packs).
- Deep courier integration with real-time shipping APIs.
- Advanced recommendation engine and experimentation platform.
- Enterprise-grade BI stack (warehouse/lakehouse).

## 4) Workstreams and Deliverables
## A. Data and Backend
- Finalize Prisma schema constraints, indexes, and enums for:
  - tenant isolation, products/variants, orders/payments, commissions/payouts, plans/subscriptions.
- Add migration set and seed data for local/dev.
- Implement repository/service layer with tenant-guarded queries.
- Add idempotent webhook handling for payment callbacks.

Deliverables:
- Stable schema + migrations
- Seed script for Glory default store and sample catalog
- API contract docs for checkout/payment/merchant onboarding

## B. Storefront and UX
- Replace placeholders with DB-backed listing and PDP.
- Variant selector (size, color, stitched/unstiched), stock-aware add-to-cart.
- Promo blocks: hero banners, left/right ad slots, countdown campaigns.
- SEO completion:
  - canonical tags per route
  - metadata templates
  - JSON-LD for Product/Offer
  - sitemap + robots finalized

Deliverables:
- Fully functional customer purchase funnel
- Responsive design pass for mobile/tablet/desktop

## C. Auth and RBAC
- NextAuth credentials flow with secure password hashing.
- Role matrix enforcement:
  - admin, merchant owner, merchant staff, customer, affiliate
- Protected routes and middleware checks for admin/merchant areas.

Deliverables:
- Auth flows: signup/login/logout/password reset baseline
- RBAC guards in API + route level

## D. Payments, Billing, and Payouts
- SSLCommerz session init + success/fail/cancel + IPN/webhook verification.
- Merchant subscription billing state:
  - trial start/end
  - active/past_due/cancelled flags
- Settlement engine:
  - gross sales
  - platform commission
  - net payable
  - bi-weekly payout records

Deliverables:
- Verified payment lifecycle
- Payout calculation and downloadable statements

## E. Merchant Program and Compliance
- Merchant application form with required docs.
- Admin review queue with approve/reject and reason logging.
- Legal acceptance capture (terms/privacy/merchant agreement versions).

Deliverables:
- End-to-end onboarding with audit trail
- Merchant readiness checklist status

## F. AI Commerce
- Visual search:
  - embedding generation pipeline for product images/text
  - pgvector similarity query endpoints
- Sales assistant:
  - inventory and policy-constrained response grounding
  - coupon suggestion only when valid
- Try-on:
  - transient upload + processing + cleanup policy

Deliverables:
- AI endpoints with deterministic fallback responses
- Safety and privacy controls documented and enforced

## G. Observability and Security
- Structured request logging and audit logs for critical admin actions.
- Basic abuse controls: rate limiting for auth, search, AI endpoints.
- File validation for merchant document uploads.

Deliverables:
- Security checklist completion
- Audit log visibility in admin panel

## 5) Execution Sequence (Recommended)
1. Data model hardening + migrations + seed data.
2. Auth/RBAC and tenant-safe query layer.
3. Commerce core (catalog/cart/checkout/order lifecycle).
4. SSLCommerz and payout ledger.
5. Admin and merchant dashboards (operational controls).
6. AI visual search + sales assistant + try-on integration.
7. SEO, policy pages, performance, and launch hardening.

## 6) Acceptance Criteria
- Tenant isolation verified: no cross-merchant data leakage in API/UI.
- Checkout completes with SSLCommerz and updates order/payment status correctly.
- Inventory decrements and stock-out prevents checkout.
- Merchant onboarding requires docs and legal acceptance before activation.
- Commission and bi-weekly payout calculations match configured rules.
- AI search returns exact/close alternatives and handles no-match with restock request path.
- Core pages pass Lighthouse baseline:
  - Performance >= 75
  - SEO >= 90
  - Accessibility >= 85

## 7) Testing Plan
- Unit tests:
  - pricing, coupon, points, commission, payout calculators
  - tenant guard utilities
- Integration tests:
  - checkout/payment callbacks
  - merchant approval and subscription state transitions
  - inventory mutation consistency
- E2E tests:
  - customer purchase journey
  - merchant product publish flow
  - admin approval and payout workflow

## 8) Risks and Mitigations
- Payment callback inconsistencies:
  - use idempotency keys, retry-safe handlers, signature verification.
- AI response drift:
  - constrain with inventory-grounded retrieval and policy prompts.
- Tenant leakage risk:
  - mandatory tenant filters in service layer + tests.
- KYC document sensitivity:
  - secure object storage policy, signed URLs, strict access controls.

## 9) Phase 2 Definition of Done
- Customer can browse, purchase, pay, and receive order status updates.
- Merchants can apply, get approved, manage catalog, and receive payout records.
- Admin can govern compliance, commissions, plans, and promotions.
- AI features deliver practical shopping value without violating privacy policy.
- Platform is deployable with documented env config and runbook.

