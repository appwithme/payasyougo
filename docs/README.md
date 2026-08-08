# PayAsYouGo Documentation

Welcome to the PayAsYouGo documentation. Start with the [project README](../README.md) for setup and quick start.

## Documentation Index

| Document | Audience | Description |
|----------|----------|-------------|
| [Overview](./OVERVIEW.md) | All | Background, problem statement, aims, and scope |
| [Architecture](./ARCHITECTURE.md) | Developers | Client-server design, folder structure, data flow |
| [Data Models](./DATA_MODELS.md) | Developers | TypeScript types and planned database schema |
| [Navigation](./NAVIGATION.md) | Developers / QA | Screen flows and navigator hierarchy |
| [Routes](./ROUTES.md) | All | UCC campus routes and fares |
| [Services](./SERVICES.md) | Developers | Mock payment, transaction, and notification layers |
| [Backend Plan](./BACKEND.md) | Developers | Neon PostgreSQL + Express API architecture |
| [Implementation Plan](./IMPLEMENTATION_PLAN.md) | Team | Production roadmap and open decisions |
| [Tasks](./TASKS.md) | Team | Actionable phase checklist |
| [User Manual](./USER_MANUAL.md) | End users | How to use the app as passenger or driver |
| [Deployment](./DEPLOYMENT.md) | DevOps | Expo, API, and database deployment |
| [Environment](./ENVIRONMENT.md) | Developers | Environment variables |

## Current vs Planned

| Area | Current (prototype) | Planned (production) |
|------|---------------------|----------------------|
| Database | In-memory mock data | Neon PostgreSQL |
| API | None | Node.js + Express REST API |
| Auth | Mock phone/password + OTP UI | JWT + real OTP (SMS) |
| Payments | Simulated MoMo | Paystack or Hubtel |
| Real-time | In-app notification service | Expo Push Notifications |
| Persistence | None (session lost on restart) | PostgreSQL + optional AsyncStorage cache |

## Related Materials

The full academic project report (thesis) covers literature review, system analysis, testing methodology, and appendices. This `docs/` folder focuses on **developer and operational documentation** aligned with the current codebase and Neon backend direction.
