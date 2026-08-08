# Navigation & Screen Flows

Navigation is implemented with **React Navigation** — Native Stack for auth and nested flows, Bottom Tabs for main app sections.

Type definitions: `src/types/navigation.ts`

---

## Root Navigator

File: `src/navigation/RootNavigator.tsx`

Switches between three states based on `userRole` in `AppContext`:

| Condition | Screen |
|-----------|--------|
| `userRole === null` | Auth stack (Welcome, Login, Signup) |
| `userRole === 'passenger'` | `PassengerNavigator` |
| `userRole === 'driver'` | `DriverNavigator` |

---

## Shared Screens (Unauthenticated)

| Screen | File | Purpose |
|--------|------|---------|
| Welcome | `screens/shared/WelcomeScreen.tsx` | Role selection: Passenger or Driver |

### Passenger Auth

| Screen | File | Purpose |
|--------|------|---------|
| Passenger Login | `screens/passenger/PassengerLoginScreen.tsx` | Phone + password login |
| Passenger Signup | `screens/passenger/PassengerSignupScreen.tsx` | Registration with mock OTP |

### Driver Auth

| Screen | File | Purpose |
|--------|------|---------|
| Driver Login | `screens/driver/DriverLoginScreen.tsx` | Phone + password login |
| Driver Signup | `screens/driver/DriverSignupScreen.tsx` | Registration with vehicle info + mock OTP |

---

## Passenger Flow

Navigator: `src/navigation/PassengerNavigator.tsx`

### Bottom Tabs

| Tab | Stack screens |
|-----|---------------|
| **Home** | Dashboard → BookTrip → EnterDriverId → ConfirmTrip → PaymentSuccess |
| **Book** | BookTrip (direct access) |
| **History** | TripHistory |
| **Profile** | PassengerProfile |

### Screen Details

| Screen | Purpose |
|--------|---------|
| **PassengerDashboardScreen** | Greeting, "Pay for a Ride", quick routes, recent trips |
| **BookTripScreen** | Select From/To locations, view fare |
| **EnterDriverIdScreen** | Enter driver ID (e.g. DRV001), verify driver details |
| **ConfirmTripScreen** | Review trip, select MoMo provider, confirm payment |
| **PaymentSuccessScreen** | Digital receipt after successful payment |
| **TripHistoryScreen** | List of past trips with amounts and dates |
| **PassengerProfileScreen** | Name, phone, trip stats |

### Passenger Payment Flow

```
Dashboard / Book
    → BookTrip (select route)
    → EnterDriverId (verify driver)
    → ConfirmTrip (MoMo payment)
    → PaymentSuccess (receipt)
```

---

## Driver Flow

Navigator: `src/navigation/DriverNavigator.tsx`

### Bottom Tabs

| Tab | Screens |
|-----|---------|
| **Dashboard** | DriverDashboardScreen |
| **Transactions** | TransactionHistoryScreen |
| **Wallet** | WalletScreen |
| **Profile** | DriverProfileScreen |

### Screen Details

| Screen | Purpose |
|--------|---------|
| **DriverDashboardScreen** | Wallet balance, today's earnings, total trips, payment notifications |
| **TransactionHistoryScreen** | List of received payments |
| **WalletScreen** | Balance, earnings summary (today/week/month), withdraw UI (demo) |
| **DriverProfileScreen** | Name, phone, vehicle, driver ID, rating |

---

## Use Case Summary

### Passenger use cases
- Register / Login (mock OTP)
- Select route and view fare
- Enter driver ID and verify
- Confirm payment via MoMo
- View transaction history
- View profile

### Driver use cases
- Register / Login (mock OTP)
- View dashboard metrics
- View wallet balance and earnings
- View transaction history
- Receive real-time payment notification (simulated)
- View profile

---

## Navigation Params

Key typed routes (see `src/types/navigation.ts`):

```typescript
// ConfirmTrip receives route and driver info
ConfirmTrip: {
  from: string;
  to: string;
  fare: number;
  driver: Driver;
};

// PaymentSuccess receives transaction details
PaymentSuccess: {
  transaction: Transaction;
  driver: Driver;
};
```
