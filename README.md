# PayAsYouGo

A mobile transport payment application for **University of Cape Coast (UCC)** students and commercial drivers. Passengers pay fixed campus route fares digitally via Mobile Money (MoMo); drivers track earnings, wallet balance, and trip history in real time.

> **Status:** Frontend prototype with mock data services. Backend integration (Neon PostgreSQL + Express API) is planned — see [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md).

---

## Features

### Passengers
- Register and log in (mock OTP on signup)
- Select predefined campus routes with automatic fare display
- Enter a driver ID and verify driver details before paying
- Pay via simulated MoMo (MTN, Vodafone, AirtelTigo)
- View trip history and profile

### Drivers
- Register and log in
- Dashboard with wallet balance, today's earnings, and total trips
- Real-time in-app payment notifications (simulated)
- Transaction history and wallet summary
- Profile management

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile app | React Native, Expo ~54, TypeScript |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| State | React Context API (`AppProvider`) |
| Payments (prototype) | Mock MoMo service |
| Backend (planned) | Node.js, Express, Prisma, Neon PostgreSQL |
| Payments (planned) | Paystack or Hubtel MoMo API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go](https://expo.dev/go) on your phone (recommended for testing)

### Installation

```bash
git clone <repository-url>
cd payasyougo
npm install
```

### Environment

Create or verify `.env` in the project root:

```env
EXPO_PUBLIC_MOCK_MODE=true
```

Set to `false` when live payment APIs are configured (not yet implemented).

### Run the app

```bash
npx expo start
```

Then:
- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator
- Scan the **QR code** with **Expo Go** on your phone (same Wi‑Fi network)

---

## Demo Credentials

### Passenger
| Field | Value |
|-------|-------|
| Phone | `0551002000` |
| Password | `pass1234` |

### Drivers
| ID | Phone | Password |
|----|-------|----------|
| DRV001 | `0240000001` | `driver123` |
| DRV002 | `0200000002` | `driver456` |

**Signup OTP:** Any 4-digit code is accepted in mock mode.

---

## Project Structure

```
payasyougo/
├── App.tsx                 # Root component
├── app.json                # Expo config
├── src/
│   ├── components/         # Reusable UI (Button, Cards, Inputs)
│   ├── context/            # Global state (AppContext)
│   ├── data/               # Mock seed data and routes
│   ├── navigation/         # Root, Passenger, Driver navigators
│   ├── screens/            # Full-page screens
│   │   ├── driver/
│   │   ├── passenger/
│   │   └── shared/
│   ├── services/           # Payment, transaction, notification
│   ├── theme/              # Colors, spacing, typography
│   └── types/              # TypeScript interfaces
└── docs/                   # Project documentation
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
