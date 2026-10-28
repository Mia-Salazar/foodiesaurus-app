# Foodiesaurus App Constitution

Fixed rules for the app that lives in `foodiesaurus-app`. Every spec, plan, and task follows them. If a spec contradicts them, the spec is corrected. This constitution changes only when the product decision changes, and that change is written here.

## Product

Foodiesaurus helps people find restaurants that work for food allergies and intolerances. The interface is in Spanish. Copy addresses the reader as *tú*.

Rita may appear in the header and in the meteorite joke on the home hero. Instructions, errors, and empty states stay in plain language, with no extra jokes.

## Boundary with the backend

This app is a client only. Data and actions come from the HTTP endpoints the `foodiesaurus` repository already exposes.

- A spec cites the endpoint it uses. It does not invent routes, fields, or status codes.
- If an endpoint requires a session, the app requires it too. There are no shortcuts.
- Business rules (scores, averages, who may edit) stay in `foodiesaurus`. This app only shows and sends what the API already accepts.

The contract for those endpoints is `specs/001-api-contract.md`. If the code in `foodiesaurus/app/api` changes, that contract is updated before any spec changes.

## Language and accessibility

Target: WCAG 2.2 Level AAA and Spanish easy-to-read (*lectura fácil*, Plena inclusión).

- `lang="es"`. One `h1` per screen. Heading levels do not skip.
- Labels stay visible. A placeholder does not replace the label.
- A button or link says the action and makes sense on its own: `Buscar`, `Ver restaurante`, `Volver al inicio`.
- One idea per sentence. Active voice. If a hard word is needed (`alérgeno`, `provincia`), explain it the first time in plain words.
- An error says what happened and what to do next. An empty state says there is nothing and offers one next step.
- Color, an icon, or position is never the only way to convey something.
- At least 7:1 contrast on brand text. A visible focus. The screen works with a keyboard. Touch targets of at least 44 px.
- Interface copy is measured with INFLESZ. The target is *bastante fácil* (fairly easy) or *fácil* (easy), 65 or higher. *Algo difícil* (somewhat hard) and *muy difícil* (very hard) are rejected. Proper names may stay (`Rita`, provinces, restaurant names).

## Look

The app looks like the `foodiesaurus` website. These values come from that site and stay:

| Use | Value |
| --- | --- |
| Primary green | `#005c5c` |
| Light green | `#317d65` |
| Dark green | `#1f3f35` |
| Terracotta (primary button) | `#c15719` |
| Light terracotta | `#c1571a` |
| Dark terracotta | `#361309` |
| Background | `#ffffff` |
| Text | `#171717` |
| Brand headings | Teko, weights 600 and 700 |
| Body text | system-ui |
| Focus | 3 px outline in `#005c5c`, offset 2 px |
| Button | minimum height 44 px (`min-h-11`), bold text |

The primary button is terracotta with white text. The secondary button is a terracotta outline on a transparent background.

## When a feature is done

A feature is done when its acceptance scenarios pass, in the order they are written. Looking similar does not replace a scenario.

Each feature is specified, planned, and split into tasks before it is implemented. One feature at a time. The first one is restaurant search.

That feature's plan chooses the stack. This constitution does not.
