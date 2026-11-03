import { Restaurant } from "@/entities/restaurant/model/restaurant";

export const RESTAURANT_SORT_OPTIONS = [
  { value: "name", label: "Nombre" },
  { value: "score-desc", label: "Puntuación: de más alta a más baja" },
  { value: "score-asc", label: "Puntuación: de más baja a más alta" },
] as const;

export type RestaurantSort = (typeof RESTAURANT_SORT_OPTIONS)[number]["value"];

export function restaurantSort(value: string | undefined): RestaurantSort {
  return RESTAURANT_SORT_OPTIONS.some((option) => option.value === value)
    ? (value as RestaurantSort)
    : "name";
}

export function sortRestaurants(
  restaurants: Restaurant[],
  sort: RestaurantSort,
): Restaurant[] {
  const copy = [...restaurants];

  if (sort === "name") {
    return copy.sort((left, right) => left.name.localeCompare(right.name, "es"));
  }

  return copy.sort((left, right) => {
    const leftMissing = left.score == null;
    const rightMissing = right.score == null;

    if (leftMissing && rightMissing) {
      return left.name.localeCompare(right.name, "es");
    }
    if (leftMissing) {
      return 1;
    }
    if (rightMissing) {
      return -1;
    }

    const diff =
      sort === "score-asc" ? left.score! - right.score! : right.score! - left.score!;
    return diff !== 0 ? diff : left.name.localeCompare(right.name, "es");
  });
}
