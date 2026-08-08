# PayAsYouGo

A mobile transport payment application for **University of Cape Coast (UCC)** students and commercial drivers. Passengers pay fixed campus route fares digitally via Mobile Money (MoMo); drivers track earnings, wallet balance, and trip history in real time.

> **Status:** Expo app + Express API on Neon PostgreSQL. MoMo payments use **Paystack test** mode. See [backend/README.md](./backend/README.md) to create Neon and run the API.

---

## Features

### Passengers
- Register and log in (JWT session)
- Select campus routes with fares from the API
- Look up drivers by ID and pay via Paystack test MoMo
- View trip history persisted in Neon

### Drivers
- Register and log in
- Dashboard with wallet balance, today's earnings, and total trips (from DB)
- Transaction history
- Profile with unique driver code

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile app | React Native, Expo ~54, TypeScript |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| State | React Context API + SecureStore JWT |
| API | Node.js, Express, Prisma |
| Database | Neon PostgreSQL |
| Payments | Paystack test Mobile Money |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [Expo Go](https://expo.dev/go) on your phone
- A [Neon](https://console.neon.tech) Postgres project
- [Paystack](https://dashboard.paystack.com) **test** API keys

### Installation

```bash
git clone <repository-url>
cd payasyougo
npm install
cd backend && npm install && cd ..
```

### Backend (Neon + Paystack)

Follow **[backend/README.md](./backend/README.md)** to:

1. Create a Neon project and copy `DATABASE_URL`
2. Add Paystack test keys to `backend/.env`
3. Run migrations + seed
4. Start the API: `npm run api`

### App environment

Copy `.env.example` → `.env` in the project root:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:4000
EXPO_PUBLIC_MOCK_MODE=false
```

Use your Mac’s LAN IP when testing on a physical phone.

### Run the app

```bash
npx expo start
```

Then scan the QR code with Expo Go (same Wi‑Fi as the API).

---

## Accounts

Register a passenger or driver from the app. The API seed also creates optional QA users for API testing only (not shown in the UI) — see `backend/prisma/seed.ts`.

---

## Project Structure

```
payasyougo/
├── App.tsx
├── app.json
├── backend/                # Express + Prisma + Neon API
│   ├── prisma/
│   └── src/
├── src/
│   ├── components/
│   ├── config/             # API URL env
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── services/           # apiClient, auth, payments, routes
│   ├── theme/
│   └── types/
└── docs/
```

---

## Campus Routes

| From | To | Fare (GHS) |
|------|-----|------------|
| Science | Casford | 3.00 |
| Science | Ayensu | 3.00 |
| Ayensu | Science | 3.00 |
| Ayensu | Casford | 5.00 |
| Casford | Science | 3.00 |
| Science | Valco | 3.00 |
| Amissah Arthur | Science | 4.00 |
| Amissah Arthur | Valco | 4.00 |
| Amissah Arthur | KNH | 5.00 |

Full route reference: [docs/ROUTES.md](./docs/ROUTES.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [Overview](./docs/OVERVIEW.md) | Project background, goals, and scope |
| [Architecture](./docs/ARCHITECTURE.md) | System design and directory layout |
| [Data Models](./docs/DATA_MODELS.md) | Users, transactions, routes |
| [Navigation](./docs/NAVIGATION.md) | Screen flows for passengers and drivers |
| [Services](./docs/SERVICES.md) | Mock API layer and payment simulation |
| [Backend Plan](./docs/BACKEND.md) | Neon PostgreSQL + Express API design |
| [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) | Production roadmap |
| [Tasks](./docs/TASKS.md) | Phase-by-phase checklist |
| [User Manual](./docs/USER_MANUAL.md) | Passenger and driver guides |
| [Deployment](./docs/DEPLOYMENT.md) | Staging and production deployment |
| [Environment](./docs/ENVIRONMENT.md) | Environment variables reference |

---

## Mock Mode

The app runs in **mock mode** by default. All auth, data, and payments use in-memory services — no backend or real MoMo charges.

| Component | Mock behavior |
|-----------|---------------|
| Auth | Phone + password against seed data; signup OTP accepts any 4 digits |
| Data | In-memory arrays in `AppContext` (lost on app restart) |
| Payments | 2.5s simulated delay, ~95% success rate |
| Notifications | In-process pub/sub (not push notifications) |

---

## Authors

University of Cape Coast — Department of Computer Science and Information Technology

- Gyebi Obed Bediako
- Oppong Emmanuel
- Rockson Mensah
- Shamsudeen N.A Osekre
- Mohammed Richmond Yaw

**Supervisor:** Mr. Sandro Amofa

---

## License

See [LICENSE](./LICENSE).
