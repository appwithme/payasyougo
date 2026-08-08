# Data Models

TypeScript definitions live in `src/types/index.ts`. This document describes current app types and the planned Neon PostgreSQL schema.

---

## Current TypeScript Types

### User (base)

```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}
```

### Passenger

Extends `User` with optional password and avatar.

```typescript
interface Passenger extends User {
  password?: string;
  avatar: string | null;
}
```

### Driver

Extends `User` with operational and financial fields.

```typescript
interface Driver extends User {
  password?: string;
  vehicle: string;
  rating: number;
  walletBalance: number;
  todayEarnings: number;
  totalTrips: number;
}
```

### Transaction

Represents a payment between passenger and driver. Fields vary by perspective (passenger vs driver view).

```typescript
interface Transaction {
  id: string;
  amount: number;
  from: string;          // origin location
  to: string;            // destination location
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  paymentRef?: string;
  provider?: string;     // MoMo provider
  // Passenger view
  driverName?: string;
  driverId?: string;
  // Driver view
  passengerName?: string;
  passengerId?: string;
}
```

### RouteInfo

```typescript
interface RouteInfo {
  id: string;
  from: string;
  to: string;
  fare: number;          // GHS
}
```

### MoMoProvider

```typescript
type MoMoProvider = 'MTN' | 'VODAFONE' | 'AIRTELTIGO';
```

---

## Entity Relationships

```
User (1) ──► (0..1) Driver profile
Passenger (1) ──► (many) Transactions
Driver (1) ──► (many) Transactions
Route (1) ──► (many) Transactions
```

---

## Planned PostgreSQL Schema (Neon)

To be implemented with Prisma in `backend/`.

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| full_name | VARCHAR | |
| phone | VARCHAR | Unique, Ghana format |
| email | VARCHAR | Optional |
| password_hash | VARCHAR | bcrypt |
| role | ENUM | `PASSENGER`, `DRIVER` |
| created_at | TIMESTAMP | |

### `drivers`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| unique_code | VARCHAR | e.g. `DRV001`, unique |
| vehicle_info | VARCHAR | |
| rating | DECIMAL | Default 5.0 |
| wallet_balance | DECIMAL | Default 0 |
| today_earnings | DECIMAL | Reset daily via cron |
| total_trips | INTEGER | Default 0 |

### `routes`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| from_location | VARCHAR | |
| to_location | VARCHAR | |
| fare | DECIMAL | GHS |
| active | BOOLEAN | Default true |

Unique constraint on `(from_location, to_location)`.

### `transactions`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| passenger_id | UUID | FK → users |
| driver_id | UUID | FK → drivers |
| route_id | UUID | FK → routes |
| amount | DECIMAL | |
| status | ENUM | `PENDING`, `COMPLETED`, `FAILED` |
| payment_ref | VARCHAR | MoMo reference |
| provider | VARCHAR | MTN, VODAFONE, AIRTELTIGO |
| created_at | TIMESTAMP | |

Denormalized fields (optional, for read performance):

- `passenger_name`, `driver_name`, `route_label`

---

## Sample JSON (Firestore-style reference)

The academic report uses Firestore document examples. Equivalent relational rows:

**User (passenger):**
```json
{
  "id": "PSG_1",
  "fullName": "Kofi Mensah",
  "phoneNumber": "0551002000",
  "role": "passenger"
}
```

**Driver:**
```json
{
  "id": "DRV001",
  "uniqueDriverCode": "DRV001",
  "walletBalance": 125.50,
  "todayEarnings": 45.00,
  "totalTrips": 15,
  "vehicleInfo": "Toyota Yaris - ER 1234-21"
}
```

**Transaction:**
```json
{
  "id": "TXN123456789",
  "passengerId": "PSG_1",
  "driverId": "DRV001",
  "routeLabel": "Science → Casford",
  "amount": 3.00,
  "status": "completed",
  "timestamp": "2023-10-25T08:30:00Z"
}
```

---

## Seed Data (Prototype)

Demo data is in `src/data/mockData.ts`:

- 1 passenger (`PSG_1`)
- 2 drivers (`DRV001`, `DRV002`)
- 9 routes across 6 campus locations
- Sample transaction history for both roles
