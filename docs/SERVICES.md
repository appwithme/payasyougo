# Services (Mock API Layer)

Business logic is isolated in `src/services/`. These modules simulate backend behavior for UI/UX development without a live server.

> **Warning:** The app runs in mock mode. Set `EXPO_PUBLIC_MOCK_MODE=false` only after live payment APIs are configured.

---

## paymentService.ts

Simulates Mobile Money (MoMo) payment processing.

### Configuration

```typescript
const MOCK_MODE = process.env.EXPO_PUBLIC_MOCK_MODE !== 'false';
```

Defaults to mock unless explicitly set to `'false'`.

### API

```typescript
processMoMoPayment({
  provider: 'MTN' | 'VODAFONE' | 'AIRTELTIGO',
  phone: string,
  amount: number,
}): Promise<PaymentResult>
```

### Mock behavior

| Behavior | Detail |
|----------|--------|
| Delay | 2.5 seconds (simulates MoMo prompt) |
| Success rate | ~95% |
| Failure messages | "User cancelled" or "insufficient funds" |
| Reference | `MOMO_TXN<random>` |
| Validation | Rejects `amount <= 0` |

### Live mode

Throws: `"Live payment gateway not yet configured."`

### Production plan

Replace with API call:

```
POST /api/payments/initiate
→ Paystack/Hubtel MoMo prompt
→ Webhook confirms payment
→ GET /api/payments/:id/status
```

---

## transactionService.ts

Creates paired transaction records for passenger and driver perspectives.

### API

```typescript
createTransactionRecord({
  passengerId, passengerName,
  driverId, driverName,
  from, to, fare,
  paymentRef?, provider?,
}): { driverRecord, passengerRecord }
```

### Behavior

- Generates unique ID via `generateTransactionId()` → `TXN<random>`
- Sets `status: 'completed'`
- Timestamps with current date/time
- Returns role-specific records (passenger sees driver info; driver sees passenger info)

### Production plan

Move to server-side atomic transaction:

```sql
BEGIN;
  INSERT INTO transactions (...);
  UPDATE drivers SET wallet_balance = wallet_balance + amount, ...;
COMMIT;
```

---

## notificationService.ts

In-memory pub/sub for simulating real-time driver alerts.

### API

```typescript
subscribe(listenerId, callback): unsubscribeFn
pushPaymentNotification({ driverId, payload }): void
```

### Behavior

- Single listener registered by `AppContext` as `'app_context'`
- On payment: emits `{ type: 'PAYMENT_RECEIVED', driverId, payload }`
- Driver dashboard shows notification if logged-in driver matches

### Limitations

- Same-process only (not true push notifications)
- Does not work across devices or when app is backgrounded

### Production plan

Replace with **Expo Push Notifications**:

```
Payment webhook → Backend → FCM/APNs → Driver device
```

---

## AppContext Integration

`src/context/AppContext.tsx` orchestrates services:

| Action | Services used |
|--------|---------------|
| Login / Signup | Direct mock data lookup |
| Payment | `paymentService` → `transactionService` → `notificationService` |
| Withdraw | Local state update (UI demo only on WalletScreen) |

### finalizePaymentTransaction flow

1. Call `paymentService.processMoMoPayment()`
2. On success, `transactionService.createTransactionRecord()`
3. Update driver wallet in local state
4. Append records to trip/transaction lists
5. `notificationService.pushPaymentNotification()`

---

## Migration Path

When the Neon backend is ready:

| Service | Replace with |
|---------|--------------|
| Auth in AppContext | `authService.ts` → `POST /api/auth/login` |
| mockData routes | `routeService.ts` → `GET /api/routes` |
| paymentService | `POST /api/payments/initiate` |
| transactionService | Server-side only (webhook creates records) |
| notificationService | Expo Push + backend trigger |

Keep service interfaces stable so screens require minimal changes.
