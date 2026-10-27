# Foodiesaurus HTTP contract

Source for the specs in `foodiesaurus-app`. It describes the Route Handlers in `foodiesaurus/app/api` as they are today. A spec cites an entry in this file. If a handler changes, this entry is updated before the spec changes.

Paths hang off the `foodiesaurus` origin. Each feature's plan chooses the base URL.

Bodies are JSON (`Content-Type: application/json`). The session is the Auth.js cookie. There is no `Authorization` header.

`error` strings are in English. The app uses them to decide what happened. The sentence the person sees is in Spanish, as the constitution requires.

An optional field with no value is omitted from the JSON.

## Shared shapes

### List restaurant

Returned by search, manual create, and edit.

```json
{
  "id": 1,
  "name": "Friki Pizza",
  "province": "Madrid",
  "address": "Calle de Alcántara, 71",
  "zip": "28006",
  "url": "https://ejemplo.test",
  "phone": "910000000",
  "foodType": "Pizza",
  "latitude": 40.43,
  "longitude": -3.67,
  "score": 7.5
}
```

`id`, `name`, `province`, and `address` are always present. The rest appear only when they have a value. `score` is the arithmetic mean of `generalScore` across every review. If there are no reviews, `score` is omitted. Search results are ordered by name, A to Z.

### Detail

`GET /api/restaurants/{id}`.

```json
{
  "id": 1,
  "name": "Friki Pizza",
  "province": "Madrid",
  "address": "Calle de Alcántara, 71",
  "zip": "28006",
  "url": "https://ejemplo.test",
  "phone": "910000000",
  "foodType": "Pizza",
  "latitude": 40.43,
  "longitude": -3.67,
  "averages": {
    "general": 7,
    "attention": 8,
    "allergenChartPercent": 100,
    "fidelity": 6,
    "allergicReactionPercent": 0,
    "totalReviews": 2
  },
  "reviews": [
    {
      "id": 10,
      "userName": "Foodie",
      "createdAt": "2026-01-02T12:00:00.000Z",
      "generalScore": 7,
      "allergenChart": true,
      "fidelityScore": 6,
      "attentionScore": 8,
      "allergicReaction": false,
      "comment": "Había carta de alérgenos."
    }
  ]
}
```

`averages` uses every review. If there are none, `averages` is `null`. `reviews` includes only reviews that have a comment. With no comments, `reviews` is `[]`. Detail `general` is the weighted score already calculated on the server (attention, allergen chart, chart fidelity, and reactions). It is not the same number as list `score`. An empty `userName` arrives as `"Foodie"`.

### Score sent by the person

Body for creating and editing a score. The server calculates `generalScore`. The person does not send it.

| Field | Rule |
| --- | --- |
| `hasAllergenChart` | `boolean`. Required. |
| `allergenChartQuality` | Integer from 1 to 10. Required when `hasAllergenChart` is `true`. When it is `false`, omit this field. |
| `hadAllergicReaction` | `boolean`. Required. |
| `attentionScore` | Integer from 1 to 10. Required. |
| `comment` | Optional text, at most 300 characters. An empty string is the same as omitting it. |

### Stored score

Returned by `PATCH /api/scores/{id}`.

```json
{
  "id": 10,
  "restaurantId": 1,
  "restaurantName": "Friki Pizza",
  "createdAt": "2026-01-02T12:00:00.000Z",
  "generalScore": 7,
  "allergenChart": 1,
  "fidelityScore": 6,
  "attentionScore": 8,
  "allergicReaction": 0,
  "comment": "Había carta de alérgenos."
}
```

`allergenChart` and `allergicReaction` are numbers (`1` or `0`), not booleans. `createdAt` arrives as an ISO date.

### Directory restaurant

External result from `GET /api/restaurants/lookup` when the catalog has no matches.

```json
{
  "sourceId": "nominatim-1",
  "name": "Friki Pizza",
  "address": "Calle de Alcántara, 71",
  "province": "Madrid",
  "zip": "28006",
  "latitude": 40.43,
  "longitude": -3.67
}
```

`sourceId`, `name`, and `address` are always present.

### Errors

| Status | Body | When |
| --- | --- | --- |
| 400 | `{ "error": { "field": ["message"] } }` | A value is missing or breaks a rule. `message` is in English. |
| 401 | `{ "error": "Unauthorized" }` | A session is required and there is none. |
| 404 | `{ "error": "Restaurant not found" }` or `{ "error": "Score not found" }` | It does not exist, or it exists and belongs to someone else. |
| 500 | `{ "error": "Internal server error" }` | An unexpected failure. |

On a 400, `error` is an object of fields. On 401, 404, and 500, `error` is a string.

## Session

`app/api/auth/[...nextauth]/route.ts` re-exports Auth.js (`GET` and `POST`).

- Provider: Google.
- Strategy: database session. The cookie identifies the person. `session.user.id` is a string.
- Paths the flow uses: `/api/auth/session`, `/api/auth/csrf`, `/api/auth/providers`, `/api/auth/signin/google`, `/api/auth/callback/google`, `/api/auth/signout`.

That cookie is the only session proof the other endpoints read. An app on another origin does not send it by itself. The plan for any feature that needs a session says how that cookie gets there.

## Endpoints

### `GET /api/restaurants`

Searches the catalog. No session.

Query:

| Parameter | Rule |
| --- | --- |
| `province` | Required. Text of at least 1 character. The match is exact and case-insensitive. |
| `term` | Optional. At most 40 characters. When present, the name must contain it, case-insensitive. |

`200`: `{ "data": [ List restaurant, ... ] }`. An empty list when nothing matches.

The website search offers only `Barcelona`, `Madrid`, and `Sevilla`. The server accepts any province that exists in the data. It does not sort by score. If that order is wanted, the client sorts with `score`.

### `GET /api/restaurants/{id}`

Public detail. No session.

`id` is a positive integer. Otherwise, `400`.

`200`: `{ "data": Detail }`. `404` when no restaurant has that id.

### `GET /api/restaurants/lookup`

Finds a restaurant so it can be scored. Requires a session. Without a session, `401` even when the term is valid.

Query: `term`, required, 1 to 40 characters after trimming.

`200`, one of these two shapes:

```json
{ "data": { "source": "catalog", "restaurants": [ ] } }
```

```json
{ "data": { "source": "directory", "restaurants": [ ] } }
```

If the catalog has any name match, `source` is `"catalog"` and each item is a list restaurant. Otherwise `source` is `"directory"` and each item is a directory restaurant. The directory is Nominatim.

### `POST /api/restaurants`

Creates a restaurant by hand. Requires a session. `ownerId` comes from the session. It is not sent in the body.

| Field | Rule |
| --- | --- |
| `name` | Required. 1 to 40 characters. |
| `province` | Required. 1 to 50 characters. |
| `address` | Required. 1 to 150 characters. |
| `zip` | Optional. At most 10. |
| `url` | Optional. At most 100. |
| `phone` | Optional. At most 30. |
| `foodType` | Optional. At most 40. |

An empty string on an optional field is the same as omitting it.

`201`: `{ "data": List restaurant }`.

The website form limits `province` to the list of Spanish provinces and `foodType` to a fixed list of food types. The server does not check those lists. It checks length only.

### `PATCH /api/restaurants/{id}`

Edits a restaurant created by hand by the person in the session. Requires a session. The body is the same as `POST /api/restaurants`. `id` is a positive integer.

`200`: `{ "data": List restaurant }`.

`404` with `"Restaurant not found"` when the id does not exist, when the restaurant came from the directory, or when the session is not the creator's.

### `POST /api/restaurants/{id}/scores`

Adds a score to a restaurant already in the catalog. Requires a session. The body is a score. `id` is a positive integer. The user comes from the session.

`201`: `{ "data": { "id": 10 } }`. `id` is the score id, not the restaurant id.

`404` with `"Restaurant not found"` when the restaurant does not exist.

### `POST /api/restaurants/with-score`

Creates the restaurant from the directory and stores the first score in the same request. Requires a session.

The body joins the restaurant fields and the score:

| Field | Rule |
| --- | --- |
| `name` | Required. 1 to 40. |
| `province` | Required. 1 to 50. |
| `address` | Required. 1 to 150. |
| `zip` | Optional. At most 10. |
| `apiId` | Optional. At most 150. This is the directory `sourceId`. |
| `latitude` | Optional finite number. |
| `longitude` | Optional finite number. |
| score | The same fields as in "Score sent by the person". |

`201`: `{ "data": { "id": 1 } }`. Here `id` is the id of the created restaurant.

### `PATCH /api/scores/{id}`

Edits a score that belongs to the person in the session. Requires a session. The body is a score. `id` is a positive integer and is the score id.

`200`: `{ "data": Stored score }`.

`404` with `"Score not found"` when the score does not exist or belongs to someone else.

### `DELETE /api/account`

Deletes the session's account and whatever the use case deletes with it. Requires a session. No body.

`204`: response with no body.

## What the website does and the API does not expose

These `foodiesaurus` screens read data on the server, with no Route Handler. This client cannot call them until an endpoint exists and this contract records it.

- List the restaurants the person created by hand.
- List the person's scores.
- Load one of the person's scores to fill the edit form. The `PATCH` for that score does exist.
