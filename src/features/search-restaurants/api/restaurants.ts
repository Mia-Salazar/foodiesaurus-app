import { Restaurant, RestaurantDetail } from "@/entities/restaurant/model/restaurant";
import { getApiOrigin } from "@/shared/api/config";

export type SearchRestaurantsResult =
  | { ok: true; restaurants: Restaurant[] }
  | { ok: false; reason: "failed" };

export type RestaurantDetailResult =
  | { ok: true; restaurant: RestaurantDetail }
  | { ok: false; reason: "not-found" | "failed" };

export async function searchRestaurants(
  province: string,
  term?: string,
): Promise<SearchRestaurantsResult> {
  const url = new URL("/api/restaurants", getApiOrigin());
  url.searchParams.set("province", province);
  const trimmed = term?.trim();
  if (trimmed) {
    url.searchParams.set("term", trimmed);
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return { ok: false, reason: "failed" };
    }
    const body = (await response.json()) as { data?: Restaurant[] };
    if (!Array.isArray(body.data)) {
      return { ok: false, reason: "failed" };
    }
    return { ok: true, restaurants: body.data };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

function isRestaurantDetail(value: unknown): value is RestaurantDetail {
  if (!value || typeof value !== "object") {
    return false;
  }
  const restaurant = value as RestaurantDetail;
  return (
    typeof restaurant.id === "number" &&
    typeof restaurant.name === "string" &&
    typeof restaurant.province === "string" &&
    typeof restaurant.address === "string"
  );
}

export async function getRestaurant(id: string): Promise<RestaurantDetailResult> {
  try {
    const response = await fetch(new URL(`/api/restaurants/${id}`, getApiOrigin()).toString());
    if (response.status === 404) {
      return { ok: false, reason: "not-found" };
    }
    if (!response.ok) {
      return { ok: false, reason: "failed" };
    }
    const body = (await response.json()) as { data?: unknown };
    if (!isRestaurantDetail(body.data)) {
      return { ok: false, reason: "failed" };
    }
    return { ok: true, restaurant: { ...body.data, averages: body.data.averages ?? null } };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
