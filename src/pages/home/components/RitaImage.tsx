import { Image, StyleSheet } from "react-native";

export function RitaImage() {
  return (
    <Image
      accessible
      accessibilityRole="image"
      accessibilityLabel="Rita, la dinosaurita, comiendo pizza"
      source={require("../../../../assets/rita.png")}
      style={styles.image}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 160,
  },
});
