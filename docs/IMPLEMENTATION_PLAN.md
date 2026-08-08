# Implementation Plan

Strategic roadmap for transitioning PayAsYouGo from a frontend prototype to a production-ready application with Neon PostgreSQL, live payments, and push notifications.

---

## Goal

Architect and implement backend services, integrate a live payment gateway, and connect the Expo frontend — ensuring security, scalability, and a strong user experience for UCC campus transport.

---

## Architecture Decision

| Decision | Choice |
|----------|--------|
| Database | **Neon PostgreSQL** (serverless) |
| ORM | **Prisma** |
| API | **Node.js + Express** |
| Auth | **JWT** (+ real SMS OTP in Phase 1/2) |
| Payments | **Paystack or Hubtel** (TBD) |
| Real-time | **Expo Push Notifications** |
| Mobile | **React Native + Expo** (existing) |

---

## Open Questions

> Review before starting Phase 1 execution.

1. **Payment gateway:** Paystack or Hubtel for live MoMo?
2. **OTP provider:** Firebase Phone Auth, Twilio, or Hubtel SMS?
3. **API hosting:** Render, Railway, or Fly.io?
4. **Real-time:** Push notifications only, or also WebSocket for live dashboard?

---

## Phase 1: Backend Infrastructure & Database

**Goal:** Replace mock data with Neon PostgreSQL and a REST API.

- [ ] Initialize `backend/` — Node.js + Express + TypeScript
- [ ] Create Neon project and configure `DATABASE_URL`
- [ ] Define Prisma schema (Users, Drivers, Routes, Transactions)
- [ ] Run migrations and seed UCC routes
- [ ] Implement JWT authentication (register, login, me)
- [ ] Implement route fare lookup API
- [ ] Implement driver lookup by unique code
- [ ] Create `authService.ts` in Expo app
- [ ] Replace mock login in `AppContext` with API calls
- [ ] Deploy API to staging (Render/Railway)

**Verification:** Register user → login → receive JWT → fetch routes from API.

---

## Phase 2: Live Payment Integration

**Goal:** Process real GHS transactions via Mobile Money.

- [ ] Register Paystack/Hubtel merchant account
- [ ] Implement `POST /api/payments/initiate`
- [ ] Implement webhook listener with signature verification
- [ ] Atomic transaction: payment confirm → record + wallet update
- [ ] Update `paymentService.ts` to call backend
- [ ] Handle payment status polling or push on success
- [ ] Error handling for failed/cancelled payments

**Verification:** Test MoMo payment with test number → webhook fires → driver wallet updates in DB.

> **Caution:** Real payments carry financial risk. Webhook signature verification is mandatory.

---

## Phase 3: Real-Time Features & Notifications

**Goal:** Drivers are notified immediately when paid.

- [ ] Register Expo Push tokens on driver login
- [ ] Store push tokens in database
- [ ] Backend sends push on successful payment webhook
- [ ] Update `DriverDashboardScreen` on notification receipt
- [ ] Optional: refresh wallet via API on app foreground

**Verification:** Passenger pays on Device A → Driver on Device B receives push within seconds.

---

## Phase 4: Frontend Polish & Optimization

**Goal:** Premium UX and resilience on campus networks.

- [ ] Global error handling (toast/alerts for network failures)
- [ ] Loading spinners and skeleton screens for async actions
- [ ] Offline cache of recent transactions (AsyncStorage)
- [ ] Success animations on PaymentSuccessScreen (Reanimated/Lottie)
- [ ] Session persistence (store JWT securely)
- [ ] Pull-to-refresh on history and dashboard screens

---

## Phase 5: Institutional Deployment

**Goal:** Campus pilot and app store readiness.

- [ ] Security audit (JWT, webhooks, RBAC)
- [ ] Load testing on API + Neon
- [ ] Campus pilot with selected drivers and students
- [ ] User feedback collection and iteration
- [ ] EAS Build for iOS and Android
- [ ] App Store / Play Store submission
- [ ] Admin dashboard (optional) for route and fare management

---

## Verification Plan

### Automated tests

| Layer | Tools |
|-------|-------|
| Backend | Jest + Supertest (auth, payments, webhooks) |
| Frontend | Jest + React Native Testing Library (booking flow, fare calc) |

### Manual verification

1. Deploy backend to staging
2. Run Expo app on physical iOS and Android devices
3. End-to-end: Passenger initiates → Gateway processes → Webhook → Driver dashboard updates
4. Test failure cases: invalid driver ID, cancelled payment, network timeout

---

## Timeline Estimate (Academic)

| Phase | Duration (estimate) |
|-------|---------------------|
| Phase 1 | 2–3 weeks |
| Phase 2 | 2–3 weeks |
| Phase 3 | 1 week |
| Phase 4 | 1–2 weeks |
| Phase 5 | 2+ weeks |

Adjust based on team availability and payment gateway approval time.

---

## Thesis Alignment

The academic report documents Firebase/Firestore. This plan uses **Neon PostgreSQL + Express**, which is:

- Better suited for financial transactions (ACID, relational integrity)
- Aligned with the separate implementation plan document
- More appropriate for Paystack/Hubtel webhook integration

Update thesis Chapter 3–4 to reflect the chosen production architecture, while noting the current prototype uses mock services.

See also: [Backend Plan](./BACKEND.md) | [Tasks](./TASKS.md)
