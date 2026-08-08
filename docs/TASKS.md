# Implementation Tasks

Actionable checklist derived from the [Implementation Plan](./IMPLEMENTATION_PLAN.md).

---

## Phase 1: Backend Infrastructure & Database

- [ ] Create `backend/` directory with Node.js + Express + TypeScript
- [ ] Install Prisma and initialize schema
- [ ] Create Neon project at [neon.tech](https://neon.tech)
- [ ] Configure `DATABASE_URL` in `backend/.env`
- [ ] Define Prisma models: User, Driver, Route, Transaction
- [ ] Write and run initial migration
- [ ] Create seed script with UCC routes and demo users
- [ ] Implement password hashing (bcrypt)
- [ ] Implement JWT issue and verification middleware
- [ ] `POST /api/auth/register` — passenger and driver
- [ ] `POST /api/auth/login`
- [ ] `GET /api/auth/me`
- [ ] `GET /api/routes` and `GET /api/routes/fare`
- [ ] `GET /api/drivers/:code` — driver lookup
- [ ] Add CORS for Expo app origin
- [ ] Create `src/services/apiClient.ts` in mobile app
- [ ] Create `src/services/authService.ts` in mobile app
- [ ] Replace mock auth in `AppContext` with API calls
- [ ] Deploy API to Render/Railway staging
- [ ] Test auth + routes end-to-end on physical device

---

## Phase 2: Live Payment Integration

- [ ] Choose payment provider (Paystack or Hubtel)
- [ ] Obtain API keys and configure webhook URL
- [ ] `POST /api/payments/initiate` — start MoMo charge
- [ ] `POST /api/payments/webhook` — handle provider callback
- [ ] Verify webhook signatures
- [ ] Atomic DB transaction on payment success
- [ ] `GET /api/payments/:id/status` — status polling
- [ ] Update `paymentService.ts` for live API calls
- [ ] Set `EXPO_PUBLIC_MOCK_MODE=false` in production `.env`
- [ ] Handle payment errors in `ConfirmTripScreen`
- [ ] Test with provider sandbox/test MoMo number

---

## Phase 3: Real-Time Features & Notifications

- [ ] Install `expo-notifications`
- [ ] Request notification permissions on driver login
- [ ] Store Expo push token via `POST /api/drivers/push-token`
- [ ] Send push from backend on payment webhook success
- [ ] Handle notification tap → navigate to dashboard
- [ ] Refresh wallet data on notification receipt
- [ ] Test cross-device: passenger pays, driver notified

---

## Phase 4: Frontend Polish & Optimization

- [ ] Add toast/alert library for global error handling
- [ ] Add loading states to all async screens
- [ ] Add skeleton loaders for dashboard and history
- [ ] Cache recent transactions in AsyncStorage
- [ ] Persist JWT in SecureStore
- [ ] Add pull-to-refresh on history screens
- [ ] Add success animation on PaymentSuccessScreen
- [ ] Wire withdraw funds UI to API (or remove if out of scope)
- [ ] Fix TypeScript `any` types in navigation params

---

## Phase 5: Deployment & Documentation

- [ ] Production Neon database (separate from dev)
- [ ] Production API deployment with HTTPS
- [ ] Environment variables documented in [ENVIRONMENT.md](./ENVIRONMENT.md)
- [ ] EAS Build configuration for iOS/Android
- [ ] Campus pilot test plan
- [ ] Update thesis with Neon architecture
- [ ] App Store / Play Store assets and submission

---

## Completed (Prototype)

- [x] React Native + Expo project setup
- [x] TypeScript strict typing
- [x] Passenger and driver navigation flows
- [x] Mock authentication (phone + password, OTP UI)
- [x] Route selection with automatic fares
- [x] Driver ID verification
- [x] Mock MoMo payment simulation
- [x] Transaction history (passenger + driver)
- [x] Driver wallet and earnings display
- [x] In-app payment notifications (simulated)
- [x] Yellow/white design system
- [x] Project documentation and README

---

## Priority Order

If time is limited, implement in this order:

1. **Phase 1** (auth + routes + driver lookup) — minimum viable backend
2. **Phase 2** (payments) — core product value
3. **Phase 3** (push notifications) — driver experience
4. **Phase 4** (polish) — UX improvements
5. **Phase 5** (deployment) — go live
