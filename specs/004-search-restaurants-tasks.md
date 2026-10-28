# Tasks: Search restaurants

Build `specs/002-search-restaurants.md` the way `specs/003-search-restaurants-plan.md` describes. Do these tasks in order. A task is done when its test passes. The next task stays unstarted until then.

Tests use Jest and React Native Testing Library. `fetch` is mocked. Titles are in English, in Given / When / Then form. Interface copy stays in Spanish.

Nothing in these tasks adds creating a restaurant, signing in, the profile, deleting an account, the map, the averages breakdown, comments, scoring, or editing.

## T1. App shell

**Scenario:** the plan's stack and routes.

**Done when:** the Expo app opens on `/`, `/restaurants`, and `/restaurants/1`. The root is Spanish. `theme.ts` holds the constitution colors. `EXPO_PUBLIC_API_URL` is the only API origin, and no screen calls `fetch` yet.

## T2. Home search

**Scenario:** Home, and the form copy.

**Done when:** the heading is Rita's meteorite joke, the image alternative text is `Rita, la dinosaurita, comiendo pizza`, and the form title is `Busca un restaurante`. Province is `Madrid`. The name is empty, labelled `Nombre`, limited to 40 characters, with its help sentence. Province is labelled `Provincia`, offers only `Barcelona`, `Madrid`, and `Sevilla`, and has its help sentence. `Buscar` is present. The placeholder does not replace the label. Rendering the home does not call `fetch`.

## T3. Search by province

**Scenario:** Search by province.

**Done when:** pressing `Buscar` with `Madrid` and an empty name requests `GET /api/restaurants?province=Madrid` and does not send `term` or `sort`. The heading is `Restaurantes en Madrid`. One result reads `1 restaurante`. More than one reads `N restaurantes`. Each card shows the name, and the address, zip, province, food type, and phone when those fields arrived. A `score` of `7` shows `7` and `/10`. A `score` of `7.5` shows `7,5` and `/10`. A missing `score` shows `Sin puntuación`. The order is by name, A to Z, in Spanish. Each card has `Ver {name}`. The same request shape works for `Barcelona` and `Sevilla`.

## T4. Loading the search

**Scenario:** While it loads, the search half.

**Done when:** while `GET /api/restaurants` is in flight, the results screen shows `Buscando restaurantes.` That sentence is still there if a spinner is also shown. The previous list is not shown.

## T5. Search by name

**Scenario:** Search by province and name.

**Done when:** searching `Madrid` with the name `  Friki  ` requests `GET /api/restaurants?province=Madrid&term=Friki`. The results form shows the trimmed name. Under the heading the screen shows `Restaurantes que coinciden con Friki`. The cards are the `data` array from that response.

## T6. Sort

**Scenario:** Sort.

**Done when:** a list of two or more restaurants shows `Ordenar`, selected on `Nombre`, with the choices `Nombre`, `Puntuación: de más alta a más baja`, and `Puntuación: de más baja a más alta`. Choosing the highest-first choice keeps the same restaurants, puts the highest `score` first, puts restaurants without `score` last, and breaks ties by name in Spanish. The results route keeps `score-desc` together with the province and the name. Leaving that screen and opening the same route shows that order again. The lowest-first choice puts the lowest `score` first and still leaves missing scores last. Choosing `Nombre` again orders by name and removes `sort` from the route.

## T7. Open a restaurant

**Scenario:** Open a restaurant, the found half.

**Done when:** activating `Ver Friki Pizza` requests `GET /api/restaurants/{id}` with that id. The heading is the name. The province is shown. `Datos del restaurante` shows the address, joined with the zip and province that arrived. The phone can be dialed. The website control reads `Visitar la web de {name}`. The food type is labelled `Tipo de comida`. When `averages` is present, `averages.general` is shown out of 10. `totalReviews` of 1 reads `1 opinión`. A greater count reads `N opiniones`.

## T8. Loading the detail

**Scenario:** While it loads, the detail half.

**Done when:** while `GET /api/restaurants/{id}` is in flight, the screen shows `Cargando el restaurante.` That sentence is still there if a spinner is also shown.

## T9. A restaurant with no scores

**Scenario:** Open a restaurant, when `averages` is `null`.

**Done when:** the detail shows `Sin puntuaciones todavía.` and does not show an opinion count.

## T10. Back to the province list

**Scenario:** Open a restaurant, `Volver a restaurantes`.

**Done when:** that control opens `/restaurants?province={province}` with no `term` and no `sort`, and the list is ordered by name.

## T11. No matches

**Scenario:** No matches.

**Done when:** `data: []` shows `0 restaurantes`, the heading `No hay restaurantes con esa búsqueda`, and `Prueba con otro nombre o con otra provincia.` The search form stays. `Crear restaurante` is absent. `Ordenar` is absent.

## T12. Results without a province

**Scenario:** Province missing on the results screen.

**Done when:** `/restaurants` with no province does not call `GET /api/restaurants`. The screen shows `Elige una provincia. Así verás los restaurantes de esa zona.` and `Volver al inicio`, which opens `/`. The home province control has no empty choice, so `Buscar` always sends a province.

## T13. Search failure

**Scenario:** The search fails.

**Done when:** a network failure, a 400, and a 500 each show `No hemos podido mostrar los restaurantes. Prueba otra vez.` as an alert. The English `error` body is not on screen. The list is absent. `Ordenar` is absent.

## T14. Detail not found

**Scenario:** The detail fails, the not-found half.

**Done when:** an id that is not a positive integer shows `Restaurante no encontrado` and does not call `fetch`. A 404 shows the same heading, `Ese restaurante no está en la lista. Vuelve a la búsqueda.`, and `Volver al inicio`.

## T15. Detail failure

**Scenario:** The detail fails, the error half.

**Done when:** a network failure and a 500 each show `No hemos podido mostrar el restaurante. Prueba otra vez.` as an alert.

## T16. Manual pass

**Scenario:** the plan's manual check.

**Done when:** with `foodiesaurus` running, the simulator shows the home, a real province, a name with no matches, the three sort orders after leaving the results and coming back, and one detail. This task is checked by hand. It does not add a test file.
