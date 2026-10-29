import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { Restaurant } from "@/entities/restaurant/model/restaurant";
import { RestaurantCard } from "@/entities/restaurant/ui/RestaurantCard";
import { searchRestaurants } from "@/features/search-restaurants/api/restaurants";
import { sortByName } from "@/features/search-restaurants/lib/sortRestaurants";
import { SearchForm } from "@/features/search-restaurants/ui/SearchForm";
import { theme } from "@/shared/theme";

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function countCopy(count: number): string {
  return count === 1 ? "1 restaurante" : `${count} restaurantes`;
}

export function ResultsPage() {
  const params = useLocalSearchParams<{ province?: string; term?: string }>();
  const province = single(params.province);
  const term = single(params.term);
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    if (!province) {
      return;
    }

    let active = true;
    setRestaurants(null);
    searchRestaurants(province, term).then((result) => {
      if (!active || !result.ok) {
        return;
      }
      setRestaurants(sortByName(result.restaurants));
    });

    return () => {
      active = false;
    };
  }, [province, term]);

  const title = province ? `Restaurantes en ${province}` : "Restaurantes";

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {province ? (
        <SearchForm initialProvince={province} initialTerm={term ?? ""} />
      ) : null}
      {restaurants ? (
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
  count: {
    color: theme.color.text,
    fontSize: 16,
  },
});
