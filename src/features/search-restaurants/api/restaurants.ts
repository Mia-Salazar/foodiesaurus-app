import { Restaurant } from "@/entities/restaurant/model/restaurant";
import { getApiOrigin } from "@/shared/api/config";

export type SearchRestaurantsResult =
  | { ok: true; restaurants: Restaurant[] }
  | { ok: false; reason: "failed" };

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
