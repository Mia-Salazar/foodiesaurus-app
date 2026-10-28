import { StyleSheet, Text } from "react-native";

import { theme } from "@/shared/theme";

export function HeroText() {
  return (
    <>
      <Text accessibilityRole="header" style={styles.joke}>
        ¡El meteorito no me extinguió, pero unas{" "}
        <Text style={styles.gambas}>gambas</Text> casi lo hacen!
      </Text>
      <Text style={styles.support}>
        <Text style={styles.supportName}>Rita, la dinosaurita</Text> te ayuda a
        encontrar restaurantes seguros si tienes alergia.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
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
