<div align="center">

<img src="./assets/brand/logo-pin-p.png" alt="PayAsYouGo" width="96" />

# PayAsYouGo

**Campus rides. Instant MoMo. Zero cash friction.**

A mobile transport payment app for **University of Cape Coast (UCC)** — passengers pay fixed campus fares with Mobile Money; drivers get paid into a live wallet.

<br />

![Expo](https://img.shields.io/badge/Expo-54-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Paystack](https://img.shields.io/badge/Paystack-MoMo-00C3F7?style=for-the-badge&logo=paystack&logoColor=white)

<br />

<img src="./assets/brand/momo-icon.png" alt="MTN MoMo" width="40" height="40" />
&nbsp;&nbsp;
<img src="./assets/brand/telecel-cash.png" alt="Telecel Cash" width="40" height="40" />

<sub>Pay with **MTN MoMo** or **Telecel Cash** via Paystack</sub>

</div>

---

## ✨ What it does

<table>
<tr>
<td width="50%" valign="top">

### 🧳 Passengers
- Sign up / log in (JWT + optional Google)
- Pick campus **From → To** with live fares
- Link a driver by **Driver ID** or **QR scan**
- Pay MoMo (MTN / Telecel)
- Rate the driver after payment
- Trip history & profile photo

</td>
<td width="50%" valign="top">

### 🚕 Drivers
- Unique **Driver ID** + QR code for passengers
- Live wallet, today’s earnings & MoMo withdrawals
- Trip / payment history
- Profile with vehicle + rating
- Ghana Card + licence capture on signup (campus pilot)

</td>
</tr>
</table>

---

## 🧱 Stack

| Layer | Tech |
|:------|:-----|
| 📱 App | React Native · Expo ~54 · TypeScript |
| 🧭 Nav | React Navigation (tabs + stacks) · floating tab bar |
| 🔐 Session | SecureStore JWT · React Context |
| 🖥️ API | Node.js · Express · Prisma |
| 🗄️ DB | Neon PostgreSQL |
| 💳 Payments | Paystack Mobile Money (GHS) |

---

## 🚀 Quick start

### Prerequisites

- Node.js **18+** & npm  
- [Expo Go](https://expo.dev/go)  
- [Neon](https://console.neon.tech) Postgres project  
- [Paystack](https://dashboard.paystack.com) **test** API keys  

### 1 · Install

```bash
git clone <repository-url>
cd payasyougo
npm install
cd backend && npm install && cd ..
```

### 2 · Backend

Follow **[backend/README.md](./backend/README.md)** (Neon + Paystack + migrate + seed), then:

```bash
cd backend
npm run dev
```

API health: `GET http://localhost:4000/health`

**Neon `DATABASE_URL` tip:** use the pooled connection string with `sslmode=require` and a longer connect timeout (cold starts). Prefer:

```env
DATABASE_URL="postgresql://…@…-pooler.…/neondb?sslmode=require&connect_timeout=15"
```

Avoid `channel_binding=require` — Prisma often fails to connect with that flag.

### 3 · App env

Root `.env` (from `.env.example`):

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:4000

# Optional — passenger Google sign-in (Web client ID is enough for Expo)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
```

> 💡 Use your Mac’s **LAN IP** (not `localhost`) when testing on a physical phone. Simulator can use `http://localhost:4000`.

### 4 · Run Expo

```bash
npx expo start
```

Scan the QR with Expo Go (same Wi‑Fi as the API). Restart Expo after changing any `EXPO_PUBLIC_*` env var.

### First launch vs logout

| Moment | Screen |
|:-------|:-------|
| **First install** (onboarding not completed) | Intro carousel → then Welcome |
| **Later cold starts** | Welcome (role picker) |
| **After logout** | Welcome — not the intro carousel |

Onboarding is stored in AsyncStorage (`payasyougo_onboarding_v6`) and only shown once until that key is cleared or bumped.

---

## 💳 Paystack MoMo (important)

Payments use Paystack’s **charge** API; driver **withdrawals** use **transfer** to MoMo. The app collects:

| Field | Why |
|:------|:----|
| Network (MTN / Telecel) | Maps to Paystack `mtn` / `vod` (charges) or bank codes `MTN` / `VOD` (payouts) |
| MoMo phone number | Where the payment prompt is sent, or where the withdrawal is paid out |

Receipt details (route, amount, driver, reference) come from **your database** after Paystack confirms — not from that phone field alone.

### 🧪 Test mode

With `sk_test_…` keys, **real phone numbers are declined**. Use Paystack’s official test number for **both** passenger payments and driver withdrawals:

| Network | Test number | Used for |
|:--------|:------------|:---------|
| **MTN** | `0551234987` | Passenger pay + driver wallet withdraw (prefilled in the app) |
| **Telecel** | — | Paystack does **not** publish a Telecel/Vodafone sandbox number. Telecel cannot be end-to-end tested on test keys. |

```text
Declined. Please use the test mobile money number
since you are doing a test transaction.
```

↑ That error means you’re on test keys with a live number — switch to `0551234987` (MTN tile).

With **`sk_test_`** keys, driver withdrawals are **simulated** (wallet debited, marked complete) because Paystack Starter accounts cannot send Transfers — even in test. Live payouts need Transfers enabled + Paystack balance + Transfer OTP off.

### Going live later

1. Switch to Paystack **live** keys  
2. Use real passenger / driver MoMo numbers (MTN **or** Telecel Cash)  
3. Enable Ghana MoMo (GHS) on the Paystack business  
4. Optionally set a webhook: `POST /api/payments/webhook`  
   (the app also **polls** payment / withdrawal status, so local testing works without ngrok)

In **live / production**, Telecel works the same as MTN: the app sends provider `vod` to Paystack, and the user approves on their real Telecel Cash number. No special sandbox workaround is needed once live keys are enabled.

---

## 👤 Seeded test accounts

| Role | Name | Phone | Password | Driver ID |
|:-----|:-----|:------|:---------|:----------|
| Passenger | Kofi Mensah | `0550000111` | `admin123` | — |
| Driver | Kwame Owusu | `0240000001` | `driver123` | `DRV001` |
| Driver | Ama Asantewaa | `0200000002` | `driver456` | `DRV002` |
| Driver | Kwame Asiamah | `0240000111` | `admin123` | `DRV100` |

Created by `prisma/seed.ts` (re-run after a fresh Neon DB). Login screens include **Autofill test account** for local QA.

**New driver registration** is a 4-step flow: Account → Ghana Card verify → Licence verify → Vehicle. Ghana Card must look like `GHA-XXXXXXXXX-X`. Licence numbers are checked for format uniqueness (campus pilot — not live NIA/DVLA). Signup autofill only fills the **current** step so later steps don’t wipe ID verification.

Drivers can show a **QR code** from the dashboard. Passengers scan it on **Link driver** instead of typing the ID.

```bash
cd backend && npm run prisma:seed
```

### Google sign-in (passengers)

1. Create OAuth clients in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)  
2. For the **Web** client, add authorized redirect URI: `https://localhost`  
3. Root `.env` — **Web client ID is required** for the in-app button:
   ```env
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxxx.apps.googleusercontent.com
   ```
4. `backend/.env` — same Web ID + client secret (for code exchange):
   ```env
   GOOGLE_WEB_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-…
   ```
5. Optional: iOS / Android client IDs for native audiences  
6. Restart API + Expo  

Without `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, the login UI shows a setup hint instead of **Continue with Google**.

---

## 📁 Project layout

```text
payasyougo/
├── 📱 App.tsx / app.json
├── 🖼️ assets/brand/          # logo, welcome video, MoMo & Telecel marks
├── 🖼️ assets/id/             # Ghana Card / licence example images
├── 🖥️ backend/
│   ├── prisma/               # schema · migrations · seed
│   └── src/                  # Express · Paystack · auth
├── 📂 src/
│   ├── components/           # Auth sheet, Google button, ID capture, …
│   ├── data/                 # QA autofill samples
│   ├── navigation/           # Floating tab bar + stacks
│   ├── screens/              # passenger · driver · shared
│   ├── services/             # API · payments · auth · Google
│   └── theme/                # colors · typography
```

---

## 🗺️ Campus routes

Fares live in Neon (seeded). Stops include Science, Casford, Ayensu, Valco, Amissah Arthur, KNH, and more — **bidirectional** pairs where configured.

---

## 👥 Authors

**University of Cape Coast** — Department of Computer Science and Information Technology

- Gyebi Obed Bediako  
- Oppong Emmanuel  
- Rockson Mensah  
- Shamsudeen N.A Osekre  
- Mohammed Richmond Yaw  

**Supervisor:** Mr. Sandro Amofa  

---

## 📄 License

See [LICENSE](./LICENSE).

<div align="center">
<br />
<img src="./assets/brand/logo-pin-p.png" alt="" width="36" />
<br />
<sub>PayAsYouGo · UCC campus MoMo</sub>
</div>
