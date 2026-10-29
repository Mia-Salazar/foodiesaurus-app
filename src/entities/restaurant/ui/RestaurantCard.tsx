import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

import { formatScore } from "../lib/formatScore";
import { Restaurant } from "../model/restaurant";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const seeLabel = `Ver ${restaurant.name}`;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.name}>{restaurant.name}</Text>
        {restaurant.score != null ? (
          <View style={styles.score}>
            <Text style={styles.scoreValue}>{formatScore(restaurant.score)}</Text>
            <Text style={styles.scoreOutOf}>/10</Text>
          </View>
        ) : (
          <Text style={styles.missingScore}>Sin puntuación</Text>
        )}
      </View>
      {restaurant.foodType ? <Text style={styles.detail}>{restaurant.foodType}</Text> : null}
      {restaurant.address ? <Text style={styles.detail}>{restaurant.address}</Text> : null}
      {restaurant.zip ? <Text style={styles.detail}>{restaurant.zip}</Text> : null}
      {restaurant.province ? <Text style={styles.detail}>{restaurant.province}</Text> : null}
      {restaurant.phone ? <Text style={styles.detail}>{restaurant.phone}</Text> : null}
      <Link
        href={{ pathname: "/restaurants/[id]", params: { id: String(restaurant.id) } }}
        asChild
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={seeLabel}
          style={styles.link}
        >
          <Text style={styles.linkText}>{seeLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    borderWidth: 1,
    borderColor: theme.color.foodiesaurus,
    borderRadius: 4,
    backgroundColor: theme.color.background,
    padding: 16,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    flex: 1,
    color: theme.color.text,
    fontFamily: theme.font.brand,
    fontSize: 28,
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
  missingScore: {
    maxWidth: 96,
    color: theme.color.text,
    fontSize: 14,
    textAlign: "right",
  },
  detail: {
    color: theme.color.text,
    fontSize: 16,
  },
  link: {
    alignSelf: "flex-start",
    minHeight: theme.buttonMinHeight,
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: theme.color.secondary,
    paddingHorizontal: 20,
  },
  linkText: {
    color: theme.color.background,
    fontWeight: "700",
    fontSize: 14,
  },
});
