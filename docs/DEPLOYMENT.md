# Deployment Guide

Instructions for deploying the PayAsYouGo mobile app, API, and Neon database.

---

## Overview

| Component | Platform | Notes |
|-----------|----------|-------|
| Mobile app | Expo / EAS Build | Development via Expo Go; production via EAS |
| API | Render, Railway, or Fly.io | Node.js + Express |
| Database | Neon | Serverless PostgreSQL |
| Payments | Paystack / Hubtel | Webhook URL must be HTTPS |

---

## Mobile App (Expo)

### Development

```bash
npx expo start          # Local dev server
npx expo start --lan    # LAN mode for Expo Go
npx expo start --tunnel # Tunnel for different networks
```

### Production build (EAS)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Configure `eas.json` (already present in project).

3. Build:
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

4. Submit to stores:
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

### Environment for production app

```env
EXPO_PUBLIC_API_URL=https://api.payasyougo.app
EXPO_PUBLIC_MOCK_MODE=false
```

Set via EAS secrets or `eas.json` env configuration.

---

## Backend API

### Recommended hosts

| Provider | Free tier | Notes |
|----------|-----------|-------|
| [Render](https://render.com) | Yes | Simple Node.js deploy |
| [Railway](https://railway.app) | Limited | Easy Neon integration |
| [Fly.io](https://fly.io) | Limited | Global edge deployment |

### Deploy steps (Render example)

1. Push `backend/` to GitHub.
2. Create new **Web Service** on Render.
3. Set build command: `npm install && npx prisma generate && npm run build`
4. Set start command: `npm start`
5. Add environment variables (see [Environment](./ENVIRONMENT.md)).
6. Deploy and note the HTTPS URL.

### Health check

```
GET /health
→ { "status": "ok", "database": "connected" }
```

---

## Neon PostgreSQL

### Setup

1. Create account at [neon.tech](https://neon.tech).
2. Create project (e.g. `payasyougo-prod`).
3. Copy connection string:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/payasyougo?sslmode=require
   ```
4. Use separate branches/projects for **development** and **production**.

### Migrations

```bash
cd backend
npx prisma migrate deploy    # Production
npx prisma db seed           # Seed routes
```

### Backups

- Enable Neon point-in-time recovery on production tier.
- Export periodic snapshots for thesis documentation.

---

## Payment Webhooks

Payment providers require a **public HTTPS** webhook URL:

```
https://api.payasyougo.app/api/payments/webhook
```

### Paystack setup

1. Register at [paystack.com](https://paystack.com).
2. Configure webhook URL in dashboard.
3. Set `PAYSTACK_SECRET_KEY` and webhook secret in API env.
4. Test with Paystack test keys before going live.

### Security checklist

- [ ] Verify webhook signatures on every request
- [ ] Use HTTPS only
- [ ] Reject duplicate webhook deliveries (idempotency)
- [ ] Never log full payment secrets
- [ ] Rate limit webhook endpoint

---

## Staging vs Production

| Resource | Staging | Production |
|----------|---------|------------|
| Neon DB | `payasyougo-dev` | `payasyougo-prod` |
| API URL | `api-staging.payasyougo.app` | `api.payasyougo.app` |
| Paystack keys | Test keys | Live keys |
| Expo app | Internal testing (EAS) | App Store / Play Store |
| Mock mode | Can be `true` for UI testing | Must be `false` |

---

## Campus Pilot Deployment

Before full institutional rollout:

1. Deploy staging API + Neon dev database.
2. Distribute app via **EAS internal distribution** or Expo Go.
3. Register 5–10 drivers and 20–30 test passengers.
4. Run supervised payment tests with Paystack test MoMo.
5. Collect feedback on UX, network performance, and payment flow.
6. Fix issues before production deployment.

---

## Monitoring (Production)

| Tool | Purpose |
|------|---------|
| Render/Railway logs | API errors and webhook failures |
| Neon dashboard | Query performance, connection count |
| Sentry (optional) | Mobile and API error tracking |
| Paystack dashboard | Payment success/failure rates |

---

## Production Deployment Checklist

- [ ] Neon production database created and migrated
- [ ] API deployed with HTTPS
- [ ] All environment variables set
- [ ] Paystack/Hubtel live keys configured
- [ ] Webhook URL registered and tested
- [ ] `EXPO_PUBLIC_MOCK_MODE=false`
- [ ] EAS production build created
- [ ] Push notification certificates configured
- [ ] Security rules and RBAC verified
- [ ] Load test completed
- [ ] Campus pilot completed
- [ ] App store submission approved

See [Implementation Plan](./IMPLEMENTATION_PLAN.md) for full roadmap.
