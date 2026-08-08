# Architecture

## System Overview

PayAsYouGo uses a **client-server architecture**. The mobile app (client) handles UI, navigation, and user input. Backend services (planned) handle authentication, data persistence, payment processing, and notifications.

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Client                         │
│  React Native + Expo + TypeScript                        │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │ Screens  │  │ Components │  │ AppContext (state)  │  │
│  └────┬─────┘  └────────────┘  └──────────┬──────────┘  │
│       │                                    │             │
│       └──────────────┬─────────────────────┘             │
│                      │                                   │
│              ┌───────▼────────┐                          │
│              │    Services    │  (mock → API later)      │
│              └───────┬────────┘                          │
└──────────────────────┼───────────────────────────────────┘
                       │ HTTPS (planned)
┌──────────────────────▼───────────────────────────────────┐
│                  Backend API (planned)                      │
│  Node.js + Express + JWT + Prisma                          │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│              Neon PostgreSQL (planned)                      │
│  users · drivers · routes · transactions                   │
└────────────────────────────────────────────────────────────┘
```

---

## Current Prototype Architecture

In the current build, the backend layer is **replaced by mock services**:

```
Screens → AppContext → services/ → in-memory mockData
```

| Layer | Responsibility |
|-------|----------------|
| **Screens** | Full-page UI, forms, user actions |
| **Components** | Reusable UI (Button, Cards, Inputs) |
| **Navigation** | Stack and tab routing by role |
| **AppContext** | Global auth state, trips, drivers, transactions |
| **Services** | Payment simulation, transaction creation, notifications |
| **mockData** | Seed users, routes, sample transactions |

---

## Directory Structure

```
src/
├── components/          # Reusable UI
│   ├── Button.tsx
│   ├── DriverCard.tsx
│   ├── FareCard.tsx
│   ├── Header.tsx
│   ├── Input.tsx
│   ├── NotificationCard.tsx
│   ├── RouteSelector.tsx
│   ├── TransactionCard.tsx
│   └── WalletCard.tsx
├── config/              # (reserved for API/Firebase config)
├── context/
│   └── AppContext.tsx   # Global state and business logic
├── data/
│   └── mockData.ts      # Seed data, routes, demo credentials
├── navigation/
│   ├── RootNavigator.tsx
│   ├── PassengerNavigator.tsx
│   └── DriverNavigator.tsx
├── screens/
│   ├── driver/          # 6 driver screens
│   ├── passenger/       # 9 passenger screens
│   └── shared/          # WelcomeScreen
├── services/
│   ├── paymentService.ts
│   ├── transactionService.ts
│   └── notificationService.ts
├── theme/
│   └── colors.ts        # Design tokens (yellow/white theme)
└── types/
    ├── index.ts         # Domain types
    └── navigation.ts    # Navigator param lists
```

---

## Data Flow: Payment Confirmation

```
Passenger (ConfirmTripScreen)
    │
    ├─► paymentService.processMoMoPayment()
    │       └─► Mock: 2.5s delay, ~95% success
    │
    └─► AppContext.finalizePaymentTransaction()
            ├─► transactionService.createTransactionRecord()
            ├─► Update driver walletBalance, todayEarnings, totalTrips
            ├─► Append to passengerTrips + driverTransactions
            └─► notificationService.pushPaymentNotification()
                    └─► Driver dashboard shows alert (if same session)
```

---

## State Management

**React Context API** (`AppProvider`) centralizes:

| State | Description |
|-------|-------------|
| `currentUser` | Logged-in passenger or driver |
| `userRole` | `'passenger'` \| `'driver'` \| `null` |
| `passengerTrips` | Passenger transaction history |
| `driverTransactions` | Driver transaction history |
| `drivers` | In-memory driver registry (includes wallet data) |
| `pendingNotification` | Latest payment alert for driver |

Key actions: `loginPassenger`, `loginDriver`, `signupDriver`, `logout`, `finalizePaymentTransaction`, `withdrawDriverFunds`.

---

## Navigation Architecture

```
RootNavigator
├── [unauthenticated]
│   ├── Welcome
│   ├── PassengerLogin / PassengerSignup
│   └── DriverLogin / DriverSignup
├── [passenger] PassengerNavigator (bottom tabs)
│   ├── Home → BookTrip → EnterDriverId → ConfirmTrip → PaymentSuccess
│   ├── Book
│   ├── History
│   └── Profile
└── [driver] DriverNavigator (bottom tabs)
    ├── Dashboard
    ├── Transactions
    ├── Wallet
    └── Profile
```

See [Navigation](./NAVIGATION.md) for full screen reference.

---

## Design System

Defined in `src/theme/colors.ts`:

- **Primary:** Yellow (`#FFC700`) — actions, fares, highlights
- **Background:** Off-white (`#F8F9FA`) with white cards
- **Text:** Near-black headings, gray body text
- **Success:** Green for completed transactions
- **Components:** Card-based layouts, rounded corners, subtle shadows

---

## Security Model (Planned)

| Concern | Prototype | Production |
|---------|-----------|------------|
| Authentication | Mock phone/password | JWT + real SMS OTP |
| Authorization | Role-based navigation | RBAC on API + DB |
| Payments | Simulated | Gateway webhooks + signature verification |
| Data | In-memory | Encrypted HTTPS + PostgreSQL |
| Wallet updates | Single-threaded mock | DB transactions (ACID) |

See [Backend Plan](./BACKEND.md) for production security design.

---

## Scalability Considerations

- **Neon PostgreSQL:** Serverless scaling for growing transaction volume
- **API layer:** Stateless Express servers behind load balancer
- **Real-time:** Expo Push instead of persistent WebSocket connections
- **Caching:** Route data and recent transactions in AsyncStorage (planned)
