# Backend Plan (Neon PostgreSQL)

Production backend architecture for PayAsYouGo using **Neon** (serverless PostgreSQL), **Express**, **Prisma**, and **JWT** authentication.

---

## Why Neon?

| Benefit | Relevance to PayAsYouGo |
|---------|-------------------------|
| Serverless PostgreSQL | No server management; good for academic + startup scale |
| Free tier | Suitable for development and thesis demonstration |
| Prisma compatibility | Type-safe ORM, migrations, schema management |
| ACID transactions | Critical for wallet + payment consistency |
| Relational model | Users, drivers, routes, transactions with foreign keys |
| Production path | Scales to real campus deployment |

Neon is the **database layer**. You still build an **Express API** that the Expo app calls.

---

## Stack

```
Expo App  ──HTTPS──►  Express API  ──►  Neon PostgreSQL
                           │
                           ├── JWT auth
                           ├── Prisma ORM
                           ├── Paystack/Hubtel webhooks
                           └── Expo Push Notifications
```

| Component | Technology |
|-----------|------------|
| Database | Neon PostgreSQL |
| ORM | Prisma |
| API | Node.js + Express |
| Auth | JWT (access + refresh tokens) |
| Password hashing | bcrypt |
| Hosting (API) | Render, Railway, or Fly.io |
| Payments | Paystack or Hubtel (TBD) |
| Push | Expo Push Notifications |

---

## Planned Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts              # UCC routes + demo users
├── src/
│   ├── index.ts             # Express entry
│   ├── config/
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── routes.routes.ts
│   │   ├── drivers.routes.ts
│   │   ├── transactions.routes.ts
│   │   └── payments.routes.ts
│   ├── controllers/
│   ├── services/
│   └── utils/
├── package.json
└── .env
```

---

## API Endpoints (Planned)

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register passenger or driver |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/otp/send` | Send OTP (future SMS) |
| POST | `/api/auth/otp/verify` | Verify OTP |
| GET | `/api/auth/me` | Current user profile |

### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/routes` | List all active routes |
| GET | `/api/routes/fare` | `?from=X&to=Y` → fare lookup |

### Drivers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drivers/:code` | Lookup driver by unique code (DRV001) |
| GET | `/api/drivers/me/wallet` | Driver wallet + earnings |
| GET | `/api/drivers/me/transactions` | Driver transaction history |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Passenger or driver history (role-based) |
| POST | `/api/transactions` | Create transaction (after payment confirm) |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Start MoMo payment |
| GET | `/api/payments/:id/status` | Poll payment status |
| POST | `/api/payments/webhook` | Paystack/Hubtel callback |

---

## Database Schema

See [Data Models](./DATA_MODELS.md) for full table definitions.

Prisma schema sketch:

```prisma
enum Role {
  PASSENGER
  DRIVER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
}

model User {
  id           String   @id @default(uuid())
  fullName     String
  phone        String   @unique
  email        String?
  passwordHash String
  role         Role
  createdAt    DateTime @default(now())
  driver       Driver?
  transactions Transaction[] @relation("PassengerTransactions")
}

model Driver {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  uniqueCode    String   @unique
  vehicleInfo   String
  rating        Float    @default(5.0)
  walletBalance Decimal  @default(0)
  todayEarnings Decimal  @default(0)
  totalTrips    Int      @default(0)
  transactions  Transaction[]
}

model Route {
  id           String   @id @default(uuid())
  fromLocation String
  toLocation   String
  fare         Decimal
  active       Boolean  @default(true)
  transactions Transaction[]

  @@unique([fromLocation, toLocation])
}

model Transaction {
  id          String            @id @default(uuid())
  passengerId String
  passenger   User              @relation("PassengerTransactions", fields: [passengerId], references: [id])
  driverId    String
  driver      Driver            @relation(fields: [driverId], references: [id])
  routeId     String
  route       Route             @relation(fields: [routeId], references: [id])
  amount      Decimal
  status      TransactionStatus
  paymentRef  String?
  provider    String?
  createdAt   DateTime          @default(now())
}
```

---

## Payment Flow (Production)

```
1. Passenger confirms payment in app
2. POST /api/payments/initiate
3. Backend calls Paystack/Hubtel MoMo API
4. User approves on phone (MoMo prompt)
5. Provider sends webhook to POST /api/payments/webhook
6. Backend verifies webhook signature
7. Atomic DB update: transaction + driver wallet
8. Push notification to driver device
9. App polls or receives push → updates UI
```

### Security requirements

- Webhook signature verification (prevent spoofed payments)
- Idempotency keys on payment initiation
- Disable pay button after first click
- Server-side fare validation (never trust client amount)

---

## Environment Variables (Backend)

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/payasyougo?sslmode=require
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=whsec_...
EXPO_ACCESS_TOKEN=...          # For push notifications
PORT=3000
NODE_ENV=development
```

---

## Neon Setup Steps

1. Create project at [neon.tech](https://neon.tech)
2. Copy connection string → `DATABASE_URL`
3. Run `npx prisma migrate dev` to create tables
4. Run `npx prisma db seed` to insert UCC routes
5. Connect Express API to Neon via Prisma Client

---

## Real-Time Strategy

Firestore listeners are **not** used. Alternatives:

| Approach | Use case |
|----------|----------|
| Expo Push Notifications | Driver payment alerts (recommended) |
| Polling | `GET /api/drivers/me/wallet` every N seconds on dashboard |
| WebSockets | Optional for live dashboard (Socket.io) |

Push notifications are sufficient for "driver got paid" and simpler to operate.

---

## Frontend Integration

Add to Expo app:

```env
EXPO_PUBLIC_API_URL=https://your-api.onrender.com
EXPO_PUBLIC_MOCK_MODE=false
```

Replace mock service calls with `fetch()` to API endpoints. Keep the same service interface (`paymentService`, etc.) but swap implementations based on mock mode flag.
