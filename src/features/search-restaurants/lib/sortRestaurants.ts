import { Restaurant } from "@/entities/restaurant/model/restaurant";

export function sortByName(restaurants: Restaurant[]): Restaurant[] {
  return [...restaurants].sort((left, right) => left.name.localeCompare(right.name, "es"));
}
