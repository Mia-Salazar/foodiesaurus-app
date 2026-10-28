# Foodiesaurus App

Client for [Foodiesaurus](../foodiesaurus): a way to find restaurants that work for people with food allergies or intolerances. The interface is in Spanish. The accessibility target is **WCAG 2.2 Level AAA** and Spanish **lectura fácil**.

This repository is the client only. Restaurants, scores, and accounts stay in the `foodiesaurus` API. This app shows that data and sends what the API already accepts.

There is no application code yet. The first feature's plan chooses the stack.

## How work happens

Spec-driven. A feature is specified, planned, and split into tasks before it is implemented. One feature at a time. A feature is done when its acceptance scenarios pass.

Order for each feature:

1. Spec. What the person can do, with acceptance scenarios. It cites endpoints from the contract.
2. Plan. How to build it, including the stack when that is still open.
3. Tasks. One checkable behavior each.
4. Implementation.

Fixed rules live in the constitution. If a spec contradicts them, the spec is corrected.

## Documents

| Document | What it decides |
| --- | --- |
| [specs/000-constitution.md](specs/000-constitution.md) | Product, client boundary, Spanish copy, accessibility, and the look taken from the website |
| [specs/001-api-contract.md](specs/001-api-contract.md) | HTTP endpoints, bodies, and status codes as `foodiesaurus` exposes them today |
| [specs/002-search-restaurants.md](specs/002-search-restaurants.md) | First feature: search by province and name, sort, and open one restaurant |
| [specs/003-search-restaurants-plan.md](specs/003-search-restaurants-plan.md) | How that feature is built: a React Native app that calls the existing API |
| [specs/004-search-restaurants-tasks.md](specs/004-search-restaurants-tasks.md) | Ordered tasks for that feature; each one is done when its test passes |

The first feature is restaurant search. It uses `GET /api/restaurants` and `GET /api/restaurants/{id}`.

## Backend

The API lives in the sibling repository `foodiesaurus` (`app/api`). Run it from that project:

```bash
pnpm install
pnpm dev
```

Application: `http://localhost:3000`

If a Route Handler changes, update `specs/001-api-contract.md` before changing a spec.
