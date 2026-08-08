# Backend setup (Neon + Paystack test)

## 1. Create Neon from scratch

1. Go to [https://console.neon.tech](https://console.neon.tech) and sign in
2. **New Project** → name it `payasyougo` → region closest to you → Create
3. Open **Dashboard → Connection details**
4. Copy the **pooled** connection string (`DATABASE_URL`)

## 2. Configure env

```bash
cd backend
cp .env.example .env
```

Fill in:

- `DATABASE_URL` — Neon pooled URL
- `JWT_SECRET` — long random string
- `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` — from [Paystack test keys](https://dashboard.paystack.com/#/settings/developers)

## 3. Install, migrate, seed

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
```

Seed creates UCC routes plus optional QA users (for API testing only — not shown in the app UI).

## 4. Run API

```bash
npm run dev
```

Health check: `GET http://localhost:4000/health`

## 5. Paystack MoMo testing

You are on **test keys**. Real MoMo numbers are declined.

| Network | Test number | Notes |
|---------|-------------|--------|
| MTN | `0551234987` | Official Paystack Ghana test MoMo number |
| Telecel | — | No Paystack sandbox number. Use live keys + a real Telecel Cash number in production. |

In the app Confirm payment screen, use `0551234987` with the **MTN** tile for test payments. Telecel is wired (`vod`) and should work once you switch to **live** keys.

## 6. Paystack webhook (optional for local)

```bash
ngrok http 4000
```

In Paystack Dashboard → Settings → API Keys & Webhooks, set:

`https://YOUR_NGROK/api/payments/webhook`

The app also **polls** `/api/payments/:id/status`, so payments can complete without a webhook during early testing.

## 7. Point Expo at the API

In the app root `.env`:

```
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:4000
EXPO_PUBLIC_MOCK_MODE=false
```

Use your Mac’s LAN IP (not `localhost`) when testing on a physical phone via Expo Go.
