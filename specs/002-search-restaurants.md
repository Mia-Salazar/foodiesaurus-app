# Search restaurants

A person looks for a restaurant by province and, if they want, by name. They see the matches, can sort them, and open one.

This is the first feature. It follows `specs/000-constitution.md` and cites `specs/001-api-contract.md`. No session.

The visible sentences below are the interface copy. They stay in Spanish.

## Endpoints

| Action | Endpoint |
| --- | --- |
| Search | `GET /api/restaurants?province=&term=` |
| Open one | `GET /api/restaurants/{id}` |

Search sends `province` always. It sends `term` only when the name is not empty. It does not send a sort parameter. Sort uses the `score` already in the list.

The list score and the detail score are different numbers. The list shows `score`. The detail shows `averages.general`. The spec does not require them to match.

## Screens

**Home.** The search form. Province starts on `Madrid`. The name starts empty. Nothing is requested until the person presses `Buscar`.

**Results.** The matches for that search. Province, name, and sort survive a refresh. `Volver al inicio` returns to the home search.

**Detail.** One restaurant. `Volver a restaurantes` returns to the results for that restaurant's province, sorted by name.

## Copy on the form

| Control | Label | Help |
| --- | --- | --- |
| Name | `Nombre` | `Nombre del restaurante. Si no lo sabes, déjalo vacío.` |
| Province | `Provincia` | `Elige la zona. Ahora hay Madrid, Barcelona y Sevilla.` |
| Submit | `Buscar` | |

The province choices are only `Barcelona`, `Madrid`, and `Sevilla`. The name accepts at most 40 characters. The placeholder `Ejemplo: Friki Pizza` does not replace the label.

The results screen has the same form, filled with the current province and name, and the same rules.

## Scenarios

### Search by province

Given the person is on the home search
And the province is `Madrid`
And the name is empty
When they press `Buscar`
Then the app requests `GET /api/restaurants?province=Madrid`
And the results heading is `Restaurantes en Madrid`
And the count reads `1 restaurante` or `N restaurantes` for the number of items in `data`
And each restaurant shows its name
And each restaurant shows its address, zip, and province when those fields arrived
And each restaurant shows its food type and phone when those fields arrived
And a restaurant with `score` shows that score out of 10
And a restaurant without `score` shows `Sin puntuación`
And the order is by name, A to Z, in Spanish
And each restaurant has a link `Ver {name}` that makes sense on its own

`Barcelona` and `Sevilla` follow the same scenario.

A score uses one decimal and a comma when it needs a decimal: `7` or `7,5`, then `/10`.

### Search by province and name

Given the person searches in `Madrid` with the name `  Friki  `
When they press `Buscar`
Then the app requests `GET /api/restaurants?province=Madrid&term=Friki`
And the results name is the trimmed name
And under the heading they see `Restaurantes que coinciden con Friki`
And the list is the `data` array from that response

### Sort

Given the results contain at least two restaurants
Then the sort control is labelled `Ordenar`
And its choices are `Nombre`, `Puntuación: de más alta a más baja`, and `Puntuación: de más baja a más alta`
And `Nombre` is selected

When they choose `Puntuación: de más alta a más baja`
Then the same restaurants stay on screen
And the highest `score` is first
And a restaurant without `score` is after every restaurant that has one
And equal scores are ordered by name, in Spanish
And a refresh keeps this order

`Puntuación: de más baja a más alta` puts the lowest `score` first. Restaurants without `score` stay last.

When they choose `Nombre` again
Then the order is by name, A to Z

The sort control is absent when there are no restaurants or the search failed.

### Open a restaurant

Given `Friki Pizza` is in the results
When they activate `Ver Friki Pizza`
Then the app requests `GET /api/restaurants/{id}` with that restaurant's `id`
And the heading is the restaurant name
And they see its province
And they see `Datos del restaurante` with the address
And they see the phone, the website, and the food type when those fields arrived
And when `averages` is present they see `averages.general` out of 10
And when `averages.totalReviews` is 1 they see `1 opinión`
And when `averages.totalReviews` is greater than 1 they see `N opiniones`

When `averages` is `null`
Then they see `Sin puntuaciones todavía.`
And they do not see an opinion count

When they activate `Volver a restaurantes`
Then they see the results for that restaurant's province, sorted by name

### No matches

Given a search returns `{ "data": [] }`
Then the heading count reads `0 restaurantes`
And they see the heading `No hay restaurantes con esa búsqueda`
And they see `Prueba con otro nombre o con otra provincia.`
And the search form is still on the screen
And they do not see `Crear restaurante`

### Province missing on the results screen

Given the results screen is opened with no province
Then the app does not call `GET /api/restaurants`
And they see `Elige una provincia. Así verás los restaurantes de esa zona.`
And they see a link `Volver al inicio`

The home form cannot be submitted without a province.

### The search fails

Given the search request fails, or the API responds with 400 or 500
Then they see `No hemos podido mostrar los restaurantes. Prueba otra vez.`
And that message is announced as an alert
And the English `error` body is not shown
And they do not see a list

### The detail fails

Given the detail id is not a positive integer, or the API responds with 404
Then the heading is `Restaurante no encontrado`
And they see `Ese restaurante no está en la lista. Vuelve a la búsqueda.`
And they see a link `Volver al inicio`

Given the detail request fails with a 500 or cannot be completed
Then they see `No hemos podido mostrar el restaurante. Prueba otra vez.`
And that message is announced as an alert

### While it loads

While the search request is in flight they see `Buscando restaurantes.`
While the detail request is in flight they see `Cargando el restaurante.`
A spinner does not replace that sentence.

## Out of scope

- Creating a restaurant, signing in, the profile, and deleting an account.
- The map.
- The averages breakdown: attention, allergen chart, chart fidelity, and reactions.
- Comments.
- Scoring a restaurant, and editing one.
- Any endpoint other than the two in this spec.
