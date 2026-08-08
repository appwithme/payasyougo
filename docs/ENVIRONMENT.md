# Environment Variables

Reference for all environment variables used in PayAsYouGo.

---

## Mobile App (Expo)

File: `.env` in project root (not committed — add to `.gitignore` if secrets are added)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EXPO_PUBLIC_MOCK_MODE` | No | `true` | When `true`, uses mock payment service. Set `false` for live payments. |
| `EXPO_PUBLIC_API_URL` | No | — | Backend API base URL (e.g. `https://api.payasyougo.app`). Required when mock mode is off. |

### Example (development — mock)

```env
EXPO_PUBLIC_MOCK_MODE=true
```

### Example (production — live)

```env
EXPO_PUBLIC_MOCK_MODE=false
EXPO_PUBLIC_API_URL=https://api.payasyougo.app
```

> Variables prefixed with `EXPO_PUBLIC_` are embedded in the app bundle and visible to clients. Never put secrets (API secret keys, DB passwords) in Expo public variables.

---

## Backend API (Planned)

File: `backend/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `PORT` | No | Server port (default: `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `CORS_ORIGIN` | No | Allowed Expo app origin |
| `PAYSTACK_SECRET_KEY` | Phase 2 | Paystack secret key |
| `PAYSTACK_PUBLIC_KEY` | Phase 2 | Paystack public key (returned to client if needed) |
| `PAYSTACK_WEBHOOK_SECRET` | Phase 2 | Webhook signature verification |
| `HUBTEL_CLIENT_ID` | Phase 2 | Alternative to Paystack |
| `HUBTEL_CLIENT_SECRET` | Phase 2 | Alternative to Paystack |
| `EXPO_ACCESS_TOKEN` | Phase 3 | For sending Expo push notifications |
| `OTP_API_KEY` | Phase 1+ | SMS OTP provider key (Twilio, etc.) |

### Example (development)

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/payasyougo?sslmode=require
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

### Example (production)

```env
DATABASE_URL=postgresql://user:pass@ep-prod.neon.tech/payasyougo?sslmode=require
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://payasyougo.app
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=whsec_...
EXPO_ACCESS_TOKEN=...
```

---

## Neon Connection String

Format:

```
postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

Obtain from: Neon Console → Project → Connection Details.

Use **pooled connection** for serverless/API deployments:

```
postgresql://user:pass@ep-xxx.neon.tech/payasyougo?sslmode=require&pgbouncer=true
```

---

## EAS Build Secrets

For production Expo builds, set secrets via EAS CLI:

```bash
eas secret:create --name EXPO_PUBLIC_API_URL --value https://api.payasyougo.app
eas secret:create --name EXPO_PUBLIC_MOCK_MODE --value false
```

Or configure in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_MOCK_MODE": "false",
        "EXPO_PUBLIC_API_URL": "https://api.payasyougo.app"
      }
    }
  }
}
```

---

## Security Notes

- Never commit `.env` files with real secrets to Git
- Use different `JWT_SECRET` and database URLs for dev vs prod
- Rotate Paystack keys if exposed
- Backend secrets stay on the server only — never in the mobile app bundle

Current `.gitignore` excludes `.env*.local`. Consider adding `.env` to `.gitignore` if it will contain secrets (currently only has `EXPO_PUBLIC_MOCK_MODE=true`).
