import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Restaurant } from "@/entities/restaurant/model/restaurant";
import { RestaurantCard } from "@/entities/restaurant/ui/RestaurantCard";
import { searchRestaurants } from "@/features/search-restaurants/api/restaurants";
import { sortByName } from "@/features/search-restaurants/lib/sortRestaurants";
import { SearchForm } from "@/features/search-restaurants/ui/SearchForm";
import { theme } from "@/shared/theme";
import { Loader } from "@/shared/ui/atoms/Loader";

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function countCopy(count: number): string {
  return count === 1 ? "1 restaurante" : `${count} restaurantes`;
}

function searchKey(province: string, term?: string): string {
  return `${province}\n${term ?? ""}`;
}

type ReadySearch = {
  key: string;
  restaurants: Restaurant[];
};

export function ResultsPage() {
  const params = useLocalSearchParams<{ province?: string; term?: string }>();
  const province = single(params.province);
  const term = single(params.term);
  const key = province ? searchKey(province, term) : null;
  const [ready, setReady] = useState<ReadySearch | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!province || !key) {
      return;
    }

    let active = true;
    searchRestaurants(province, term).then((result) => {
      if (!active) {
        return;
      }
      if (!result.ok) {
        setFailedKey(key);
        return;
      }
      setReady({ key, restaurants: sortByName(result.restaurants) });
    });

    return () => {
      active = false;
    };
  }, [province, term, key]);

  const restaurants = ready?.key === key ? ready.restaurants : null;
  const loading = key != null && restaurants == null && failedKey !== key;
  const title = province ? `Restaurantes en ${province}` : "Restaurantes";

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {province ? (
        <SearchForm initialProvince={province} initialTerm={term ?? ""} />
      ) : null}
      {loading ? (
        <View accessibilityLiveRegion="polite" style={styles.status}>
          <Loader />
          <Text style={styles.statusText}>Buscando restaurantes.</Text>
        </View>
      ) : null}
      {restaurants !== null ? (
        <>
          <Text style={styles.count}>{countCopy(restaurants.length)}</Text>
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 16,
    padding: 16,
    backgroundColor: theme.color.background,
  },
  title: {
    color: theme.color.text,
    fontFamily: theme.font.brand,
    fontSize: 36,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusText: {
    color: theme.color.text,
    fontSize: 16,
  },
  count: {
    color: theme.color.text,
    fontSize: 16,
  },
});
