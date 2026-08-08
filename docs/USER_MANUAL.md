# User Manual

Guide for passengers and drivers using the PayAsYouGo mobile application.

---

## Installing the Application (Development)

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android).
2. Ensure your phone and computer are on the **same Wi‑Fi network**.
3. From the project directory, run:
   ```bash
   npx expo start
   ```
4. Scan the QR code with:
   - **iPhone:** Camera app (opens Expo Go)
   - **Android:** Expo Go scanner
5. Wait for the app to load.

---

## Passenger Guide

### Creating an Account

1. Open the app.
2. Tap **Passenger**.
3. Tap **Sign Up**.
4. Enter your **Full Name** and **Phone Number**.
5. Tap **Send OTP** — in mock mode, any 4-digit code works (e.g. `1234`).
6. Enter the OTP and complete registration.
7. You are redirected to the passenger dashboard.

### Logging In

1. Tap **Passenger** on the welcome screen.
2. Tap **Log In**.
3. Enter your registered phone number and password.

**Demo account:**
- Phone: `0551002000`
- Password: `pass1234`

### Making a Payment

1. From the dashboard, tap **Pay for a Ride** (or use the **Book** tab).
2. Select your **From** and **To** locations.
3. Confirm the displayed fare (e.g. GHS 3.00).
4. Tap **Continue**.
5. Enter the driver's unique ID (e.g. `DRV001`).
6. Verify the driver name and vehicle shown.
7. Tap **Continue to Payment**.
8. Select your MoMo provider (MTN, Vodafone, or AirtelTigo).
9. Tap **Confirm Payment**.
10. Wait for the simulated MoMo prompt (~2.5 seconds).
11. View your digital receipt on the success screen.

### Viewing Transaction History

1. Tap the **History** tab.
2. Browse previous trips with route, amount, driver, and date.
3. Tap a trip for details.

### Viewing Profile

1. Tap the **Profile** tab.
2. View your name, phone number, and trip statistics.

---

## Driver Guide

### Registering as a Driver

1. Open the app.
2. Tap **Driver**.
3. Tap **Sign Up**.
4. Enter:
   - Full Name
   - Phone Number
   - Vehicle Information (e.g. "Toyota Yaris - ER 1234-21")
   - Password
5. Complete mock OTP verification.
6. You receive a unique driver ID (e.g. `DRV003`).
7. Share this ID with passengers so they can pay you.

### Logging In

1. Tap **Driver** on the welcome screen.
2. Tap **Log In**.
3. Enter phone and password.

**Demo accounts:**

| Driver ID | Phone | Password |
|-----------|-------|----------|
| DRV001 | `0240000001` | `driver123` |
| DRV002 | `0200000002` | `driver456` |

### Dashboard

After login, the dashboard shows:

- **Wallet Balance** — total accumulated earnings
- **Today's Earnings** — fares received today
- **Total Trips** — number of completed payments
- **Recent Payments** — latest transactions
- **Payment notifications** — alert when a passenger pays you (same session)

### Viewing Transaction History

1. Tap the **Transactions** tab.
2. View payment amount, passenger name, route, date, and transaction ID.

### Wallet

1. Tap the **Wallet** tab.
2. View current balance and earnings summary (Today, This Week, This Month).
3. **Withdraw Funds** is a UI demonstration only in the prototype.

### Monitoring Real-Time Payments

When a passenger confirms payment to your driver ID:

- Your dashboard updates automatically (if the app is open).
- A notification card appears with payment details.

> In production, you will receive push notifications even when the app is in the background.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't connect in Expo Go | Ensure same Wi‑Fi; try `npx expo start --tunnel` |
| "Route not available" | Check From/To combination against [Routes](./ROUTES.md) |
| "Driver not found" | Verify driver ID (e.g. DRV001) with the driver |
| Payment failed | Mock mode has ~5% random failure; retry |
| Data lost after restart | Prototype uses in-memory data; backend will fix this |

---

## Campus Routes Reference

See [Routes](./ROUTES.md) for the full list of supported locations and fares.

Common routes:

| From | To | Fare |
|------|-----|------|
| Science | Casford | GHS 3.00 |
| Science | Ayensu | GHS 3.00 |
| Ayensu | Casford | GHS 5.00 |

---

## Support

For academic project inquiries, contact the development team at the University of Cape Coast, Department of Computer Science and Information Technology.

**Supervisor:** Mr. Sandro Amofa
