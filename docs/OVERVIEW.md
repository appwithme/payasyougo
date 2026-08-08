# Overview

## About PayAsYouGo

**PayAsYouGo** is a React Native mobile application for public transit payments within the **University of Cape Coast (UCC)** campus. It connects **passengers** (students and staff) with **commercial drivers** operating on fixed campus routes.

Passengers select a route, view the fixed fare, identify a driver by unique ID, and pay digitally. Drivers monitor wallet balance, daily earnings, and transaction history with real-time payment alerts.

---

## Problem Statement

Campus transport at UCC remains largely **cash-based**, causing:

- Payment delays (lack of exact change)
- No digital transaction records or proof of payment
- Fare disputes between passengers and drivers
- Poor financial tracking for drivers
- Security risks from carrying cash

PayAsYouGo addresses these by automating fare display, digital payment recording, and wallet management.

---

## Aim

Design and implement a secure, user-friendly mobile application that enables passengers to pay commercial drivers on predefined campus routes, and allows drivers to track earnings and receive payment notifications.

---

## Specific Objectives

1. Examine limitations of the existing cash-based transport payment process
2. Identify functional and non-functional requirements for passengers and drivers
3. Design a role-based mobile application architecture
4. Implement a modern yellow-and-white UI for easy navigation
5. Implement authentication (mock OTP for academic demonstration)
6. Implement route selection with automatic fare retrieval
7. Implement driver verification by unique ID before payment
8. Record transactions and update driver wallet balances atomically
9. Provide real-time payment updates to drivers
10. Provide transaction history and profile management for both roles
11. Test and evaluate the system against stated requirements

---

## Scope

### In scope
- UCC campus routes (Science, Casford, Ayensu, Valco, Amissah Arthur, KNH)
- Two user roles: **Passenger** and **Driver**
- Mock OTP authentication and simulated MoMo payments
- Transaction history, wallet, and earnings tracking
- Real-time in-app updates (simulated in prototype)

### Out of scope (current prototype)
- Real Mobile Money API integration
- Actual financial transactions
- GPS vehicle tracking
- Admin management dashboard
- App Store / Play Store deployment

---

## Significance

**For passengers:** Convenient digital payments, automatic fare display, transaction history as proof of payment.

**For drivers:** Structured wallet management, daily earnings tracking, real-time payment awareness.

**For the university:** Demonstrates how digital systems can improve campus service efficiency.

**Academically:** Practical application of React Native, TypeScript, client-server architecture, and mobile fintech concepts.

---

## Development Methodology

The project follows an **Agile** approach with incremental modules:

1. Authentication and role selection
2. Passenger booking and payment flow
3. Driver dashboard and wallet
4. Transaction history and profiles
5. Testing and UI refinement

Each module was built and tested before integration.

---

## Limitations (Prototype)

- Mock OTP — no real SMS verification
- Simulated payments — no actual MoMo charges
- In-memory data — no persistence across app restarts
- Limited load testing — not deployed campus-wide
- Requires internet for future backend; prototype works offline for mock data only

---

## Production Vision

The prototype architecture is designed to extend to:

- **Neon PostgreSQL** for persistent, relational data storage
- **Node.js/Express API** with JWT authentication
- **Paystack or Hubtel** for live MoMo payments
- **Expo Push Notifications** for driver payment alerts
- Optional admin dashboard for institutional monitoring

See [Implementation Plan](./IMPLEMENTATION_PLAN.md) and [Backend Plan](./BACKEND.md).
