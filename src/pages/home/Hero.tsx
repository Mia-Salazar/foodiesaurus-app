import { Image, StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

export function Hero() {
  return (
    <View style={styles.hero}>
      <Image
        accessible
        accessibilityRole="image"
        accessibilityLabel="Rita, la dinosaurita, comiendo pizza"
        source={require("../../../assets/rita.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text accessibilityRole="header" style={styles.joke}>
        ¡El meteorito no me extinguió, pero unas{" "}
        <Text style={styles.gambas}>gambas</Text> casi lo hacen!
      </Text>
      <Text style={styles.support}>
        <Text style={styles.supportName}>Rita, la dinosaurita</Text> te ayuda a
        encontrar restaurantes seguros si tienes alergia.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.color.background,
    paddingHorizontal: 16,
    paddingVertical: 32,
    gap: 16,
  },
  image: {
    width: "100%",
    height: 160,
  },
  joke: {
    color: theme.color.text,
    fontFamily: theme.font.brand,
    fontSize: 36,
    lineHeight: 40,
  },
  gambas: {
    backgroundColor: theme.color.secondary,
    color: theme.color.background,
  },
  support: {
    color: theme.color.text,
    fontSize: 16,
    lineHeight: 24,
  },
  supportName: {
    fontWeight: "700",
  },
});
