import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { formatScore } from "@/entities/restaurant/lib/formatScore";
import { RestaurantDetail } from "@/entities/restaurant/model/restaurant";
import { getRestaurant } from "@/features/search-restaurants/api/restaurants";
import { theme } from "@/shared/theme";
import { Loader } from "@/shared/ui/atoms/Loader";

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function present(value: string | undefined): value is string {
  return value != null && value.trim() !== "";
}

function websiteHref(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `https:${"//"}${url}`;
}

function opinionCopy(count: number): string {
  return count === 1 ? "1 opinión" : `${count} opiniones`;
}

export function RestaurantDetailPage() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = single(params.id);
  const [ready, setReady] = useState<{ id: string; restaurant: RestaurantDetail } | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;
    getRestaurant(id).then((result) => {
      if (!active) {
        return;
      }
      if (!result.ok) {
        setFailedId(id);
        return;
      }
      setReady({ id, restaurant: result.restaurant });
    });

    return () => {
      active = false;
    };
  }, [id]);

  const restaurant = ready != null && ready.id === id ? ready.restaurant : null;
  const loading = id != null && restaurant == null && failedId !== id;

  if (loading) {
    return (
      <View accessibilityLiveRegion="polite" style={styles.status}>
        <Loader />
        <Text style={styles.statusText}>Cargando el restaurante.</Text>
      </View>
    );
  }

  if (!restaurant) {
    return null;
  }

  const address = [restaurant.address, restaurant.zip, restaurant.province]
    .filter(present)
    .join(", ");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text accessibilityRole="header" style={styles.name}>
        {restaurant.name}
      </Text>
      <Text style={styles.province}>{restaurant.province}</Text>
      {restaurant.averages ? (
        <View style={styles.scoreRow}>
          <View style={styles.score}>
            <Text style={styles.scoreValue}>{formatScore(restaurant.averages.general)}</Text>
            <Text style={styles.scoreOutOf}>/10</Text>
          </View>
          <Text style={styles.opinions}>{opinionCopy(restaurant.averages.totalReviews)}</Text>
        </View>
      ) : null}
      <Text style={styles.section}>Datos del restaurante</Text>
      {present(address) ? <Text style={styles.body}>{address}</Text> : null}
      {present(restaurant.phone) ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={restaurant.phone}
          onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
          style={styles.link}
        >
          <Text style={styles.linkText}>{restaurant.phone}</Text>
        </Pressable>
      ) : null}
      {present(restaurant.url) ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Visitar la web de ${restaurant.name}`}
          onPress={() => Linking.openURL(websiteHref(restaurant.url!))}
          style={styles.link}
        >
          <Text style={styles.websiteText}>{`Visitar la web de ${restaurant.name}`}</Text>
        </Pressable>
      ) : null}
      {present(restaurant.foodType) ? (
        <View style={styles.food}>
          <Text style={styles.foodLabel}>Tipo de comida</Text>
          <Text style={styles.body}>{restaurant.foodType}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 12,
    padding: 16,
    backgroundColor: theme.color.background,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  statusText: {
    color: theme.color.text,
    fontSize: 16,
  },
  name: {
    color: theme.color.text,
    fontFamily: theme.font.brand,
    fontSize: 36,
  },
  province: {
    color: theme.color.text,
    fontSize: 16,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  score: {
    minWidth: 64,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: theme.color.foodiesaurus,
    paddingHorizontal: 8,
  },
  scoreValue: {
    color: theme.color.background,
    fontFamily: theme.font.brand,
    fontSize: 28,
    lineHeight: 28,
  },
  scoreOutOf: {
    color: theme.color.background,
    fontSize: 12,
    fontWeight: "700",
  },
  opinions: {
    color: theme.color.text,
    fontSize: 16,
  },
  section: {
    color: theme.color.text,
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    color: theme.color.text,
    fontSize: 16,
  },
  link: {
    alignSelf: "flex-start",
    minHeight: theme.buttonMinHeight,
    justifyContent: "center",
  },
  linkText: {
    color: theme.color.foodiesaurus,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  websiteText: {
    color: theme.color.foodiesaurus,
    fontSize: 16,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  food: {
    gap: 4,
  },
  foodLabel: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
