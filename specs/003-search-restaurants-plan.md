# Plan: Search restaurants

How to build `specs/002-search-restaurants.md`. This plan chooses the stack. It does not add behavior, endpoints, or screens beyond that spec. The tasks are `specs/004-search-restaurants-tasks.md`. Implementation follows those tasks in order.

## Stack

A React Native app, in this repository. It is only a client.

The project is created with Expo, and the screens are React Native screens. Expo is the toolchain that runs the app on a phone or a simulator. It does not add a second server and it does not import Prisma.

| Piece | Choice |
| --- | --- |
| UI | React Native and TypeScript |
| Toolchain | Expo |
| Navigation | Expo Router, on top of React Navigation |
| Styles | React Native styles, using the colors, type, and 44 px targets from the constitution |
| Font | Teko 600 and 700 for brand headings, system font for body text |
| Package manager | pnpm |
| Tests | Jest and React Native Testing Library |

`foodiesaurus` stays the API, on port 3000 during development.

## How the spec's refresh works on a phone

The spec says the province, the name, and the sort survive a refresh. In this app those three values live in the results route. Leaving the screen and coming back uses that same route. Reloading the app bundle keeps the route that is open.

A cold start opens the home screen. The spec does not ask the app to remember the last search after the process is killed.

## How the app calls the API

React Native `fetch` is not a browser request, so the missing CORS headers on `foodiesaurus` do not block it. The app calls the API origin directly. It does not send an `Authorization` header.

The base URL is `EXPO_PUBLIC_API_URL`.

| Where the app runs | Base URL |
| --- | --- |
| iOS simulator | `http://localhost:3000` |
| Android emulator | `http://10.0.2.2:3000` |
| A phone on the same network | `http://{the computer's LAN address}:3000` |

Android needs cleartext HTTP enabled for this local address. iOS needs local networking allowed when the base URL is not localhost. Both settings are for development against `foodiesaurus`. The app code only reads the base URL and appends the paths.

- `GET /api/restaurants?province=&term=`
- `GET /api/restaurants/{id}`

`foodiesaurus` has to be running for a manual check. The tests mock `fetch`, so they do not need it.

## Routes

| Screen | Route |
| --- | --- |
| Home | `/` |
| Results | `/restaurants?province=&term=&sort=` |
| Detail | `/restaurants/:id` |

`term` is omitted when the name is empty. `sort` is omitted when the order is by name. The other values are `score-desc` and `score-asc`. Any other `sort` value is treated as name.

Going back from a detail opens `/restaurants?province={province}` with no `term` and no `sort`. The spec asks for that province, sorted by name. It does not ask to keep the previous name.

## Screens

The root layout sets the locale to Spanish. Each screen has one heading. Touch targets are at least 44 px. Colors and the focus equivalent (a visible pressed and accessibility state) come from the constitution. Body text uses the system font. Brand headings use Teko.

**Home.** The heading is Rita's meteorite joke, as on the current website. The image is `foodiesaurus/public/img/foodiesaurus-v4.png`, copied into this app's assets, with the alternative text `Rita, la dinosaurita, comiendo pizza`. Under it, the green search band. The form title `Busca un restaurante` is a second heading. Province starts on `Madrid`. The name starts empty. Pressing `Buscar` trims the name and opens the results route. The home does not call the API.

**Results.** The heading is `Restaurantes en {province}`, or `Restaurantes` when the province is missing. The same search form is filled from the route. A province outside `Barcelona`, `Madrid`, and `Sevilla` is still searched, and the control shows that value.

When `province` is missing, render the spec's sentence and `Volver al inicio`. Do not call the API.

When `province` is present, request the list. While that request is in flight, show `Buscando restaurantes.` and do not show the previous list. Then:

| Response | What the screen shows |
| --- | --- |
| `200` and a non-empty `data` | The count, the cards, and `Ordenar` |
| `200` and `data: []` | `0 restaurantes`, the empty heading, the empty sentence, and the form. No `Crear restaurante`. No sort control |
| Network failure, 400, or 500 | The alert sentence, exposed to the screen reader as an alert. No list and no sort control. The English `error` body is ignored |

Each card shows the fields the spec lists. The control text is `Ver {name}`. `score` is formatted with one decimal and a comma (`7` or `7,5`) and a `/10`. A missing `score` exposes the text `Sin puntuación`.

**Detail.** If `id` is not a positive integer, show the not-found heading and do not call the API. Otherwise request the detail and show `Cargando el restaurante.` until it finishes.

| Response | What the screen shows |
| --- | --- |
| `200` | Name as the heading, province, opinion count from `averages.totalReviews` when `averages` is not null, `Datos del restaurante`, and `averages.general` out of 10 |
| `200` and `averages: null` | `Sin puntuaciones todavía.` and no opinion count |
| `404` | `Restaurante no encontrado`, the spec's sentence, and `Volver al inicio` |
| Network failure or 500 | The detail alert sentence, exposed as an alert |

The address line joins the address, zip, and province that arrived. The phone opens the dialer. The website control reads `Visitar la web de {name}` and opens the browser. The food type is `Tipo de comida`. `Volver a restaurantes` goes to that province's results.

The detail does not render the map, the averages breakdown, the comments, or an edit control.

## Sort

Sort the `data` array on the device. Do not send `sort` to the API.

- `name`: `localeCompare` with locale `es`.
- `score-desc` and `score-asc`: compare `score`. Restaurants without `score` stay last. Equal scores fall back to the name, in Spanish.
- Changing the control replaces the results route and keeps `province` and `term`.

The control is a native picker labelled `Ordenar`, with the three sentences from the spec.

## Files

The layout is the client half of Foodiesaurus: Feature-Sliced Design and Atomic Design. Routes stay thin. The README records the same tree.

```text
app/
  _layout.tsx
  index.tsx
  restaurants/index.tsx
  restaurants/[id].tsx
src/
  pages/
  widgets/
  features/search-restaurants/
    api/restaurants.ts
    lib/sortRestaurants.ts
  entities/restaurant/
    model/
    lib/formatScore.ts
    ui/RestaurantCard.tsx
  shared/
    api/config.ts
    theme.ts
    locale.ts
    ui/atoms/
assets/
  rita.png
```

`features/search-restaurants/api/restaurants.ts` is the only module that calls `fetch`. It returns the `data` object or a failure the screens can tell apart: not found, and any other failure. It does not parse the English field messages into the interface. The origin comes from `shared/api/config.ts`.

`shared/theme.ts` holds the constitution colors. Screens do not invent a second palette.

Task 1 still has `src/theme.ts`, `src/locale.ts`, and `src/api/config.ts`. The task that first needs each file moves it into this tree.

## Verification

Automated tests follow the spec's scenarios, with `fetch` mocked. Titles use Given / When / Then. One scenario group at a time is enough to start: search by province, search with a name, sort, open a restaurant, empty list, missing province, search failure, detail failure, and the two loading sentences.

A manual pass needs `foodiesaurus` running and the app open in a simulator. Check home, a real province, a name with no matches, the three sort orders after leaving the screen and coming back, and one detail.

## Left out of this plan

Creating a restaurant, signing in, the profile, deleting an account, the map, the averages breakdown, comments, scoring, and editing. Also any change to the `foodiesaurus` handlers. If a handler changes, the contract is updated before this plan.
