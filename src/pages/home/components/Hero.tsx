import { StyleSheet, View } from "react-native";

import { theme } from "@/shared/theme";

import { HeroText } from "./HeroText";
import { RitaImage } from "./RitaImage";

export function Hero() {
  return (
    <View style={styles.hero}>
      <RitaImage />
      <HeroText />
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
});
