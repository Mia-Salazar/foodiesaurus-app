# Foodiesaurus App

Client for [Foodiesaurus](../foodiesaurus): a way to find restaurants that work for people with food allergies or intolerances. The interface is in Spanish. The accessibility target is **WCAG 2.2 Level AAA** and Spanish **lectura fácil**.

This repository is the client only. Restaurants, scores, and accounts stay in the `foodiesaurus` API. This app shows that data and sends what the API already accepts.

The first feature is a React Native app. Task 1 is the shell: Expo Router, Spanish locale, and the constitution colors. It does not call the API yet.

## Technologies

Same client ideas as [Foodiesaurus](../foodiesaurus), on a phone instead of Next.js.

| Piece | Choice |
| --- | --- |
| UI | React Native and TypeScript |
| Toolchain | Expo |
| Navigation | Expo Router, on top of React Navigation |
| Styles | React Native styles. Colors, Teko, and 44 px targets come from the website |
| Package manager | [pnpm](https://pnpm.io) |
| Tests | Jest and React Native Testing Library |

The API, the database, and the business rules stay in `foodiesaurus`: Next.js, Prisma, and PostgreSQL. This app does not import Prisma.

## Architecture

The website is a modular monolith. This repository is only its client. The frontend follows the same two ideas:

- **Feature-Sliced Design** for screens, actions, and entities.
- **Atomic Design** for shared UI.

Clean Architecture and domain logic stay in `foodiesaurus`. A screen calls the HTTP API. It does not recalculate scores or averages.

```text
foodiesaurus-app/
├── app/                         # Expo Router. Thin routes only.
│   ├── _layout.tsx
│   ├── index.tsx                # Home
│   └── restaurants/
│       ├── index.tsx            # Results
│       └── [id].tsx             # Detail
│
└── src/
    ├── pages/                   # One screen per route
    ├── widgets/                 # Large blocks reused across screens
    ├── features/                # One user action
    │   └── search-restaurants/
    │       ├── api/             # The only fetch calls
    │       └── lib/             # sortRestaurants
    ├── entities/
    │   └── restaurant/
    │       ├── model/
    │       ├── lib/             # formatScore
    │       └── ui/              # RestaurantCard
    └── shared/                  # No business meaning
        ├── api/                 # EXPO_PUBLIC_API_URL
        ├── theme.ts
        ├── locale.ts
        └── ui/atoms/            # Button, Input, Loader
```

Dependency direction, as on the website:

- `shared` does not import pages, widgets, features, or entities.
- `entities` do not import features or pages.
- `features` may use entities and shared.
- `pages` compose widgets, features, entities, and shared.
- A route in `app/` renders a page and does not call `fetch`.

Task 1 still keeps `src/api/config.ts` at the top of `src/`. The theme and the locale already live in `shared/`.

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

## Run the app

From this directory:

```bash
pnpm install
pnpm test
pnpm start
```

`EXPO_PUBLIC_API_URL` in `.env` is `http://localhost:3000`. Use `http://10.0.2.2:3000` on the Android emulator.

## Backend

The API lives in the sibling repository `foodiesaurus` (`app/api`). Run it from that project:

```bash
pnpm install
pnpm dev
```

Application: `http://localhost:3000`

If a Route Handler changes, update `specs/001-api-contract.md` before changing a spec.
