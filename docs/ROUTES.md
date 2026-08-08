# Campus Routes

Predefined routes and fixed fares for **University of Cape Coast** campus transport.

Source: `src/data/mockData.ts`

---

## Locations

| # | Location |
|---|----------|
| 1 | Science |
| 2 | Casford |
| 3 | Ayensu |
| 4 | Amissah Arthur |
| 5 | Valco |
| 6 | KNH |

---

## Routes & Fares

All fares are in **Ghana Cedis (GHS)**.

| ID | From | To | Fare (GHS) |
|----|------|-----|------------|
| r1 | Science | Casford | 3.00 |
| r2 | Science | Ayensu | 3.00 |
| r3 | Ayensu | Science | 3.00 |
| r4 | Ayensu | Casford | 5.00 |
| r5 | Casford | Science | 3.00 |
| r6 | Amissah Arthur | Science | 4.00 |
| r7 | Amissah Arthur | Valco | 4.00 |
| r8 | Amissah Arthur | KNH | 5.00 |
| r9 | Science | Valco | 3.00 |

---

## Thesis Reference Routes

The academic report documents these four core routes (subset of the full list above):

| Route ID | From | To | Fare (GHS) |
|----------|------|-----|------------|
| rte_001 | Science | Casford | 3 |
| rte_002 | Science | Ayensu | 3 |
| rte_003 | Ayensu | Science | 3 |
| rte_004 | Ayensu | Casford | 5 |

The app includes additional routes (Valco, Amissah Arthur, KNH) for broader campus coverage.

---

## Fare Lookup Behavior

1. Passenger selects **From** and **To** on `BookTripScreen`
2. App matches the pair against `ROUTES` in mock data
3. If found → fare displayed automatically
4. If not found → error message ("Route not available")

In production, fares will be fetched from the `routes` table via API:

```
GET /api/routes?from=Science&to=Casford
→ { "fare": 3.00, "routeId": "..." }
```

---

## Administration (Planned)

Routes will be managed centrally in Neon PostgreSQL so fares can be updated without app redeployment. An admin dashboard (future) would allow university staff to modify fares and activate/deactivate routes.
