import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { appLocale } from "@/shared/locale";
import { theme } from "@/shared/theme";

export default function ResultsScreen() {
  return (
    <View
      testID="results-screen"
      accessibilityLanguage={appLocale}
      style={styles.screen}
    >
      <Stack.Screen options={{ title: "Restaurantes" }} />
      <Text style={styles.text}>Restaurantes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
    padding: 16,
  },
  text: {
    color: theme.color.text,
    fontSize: 16,
  },
});
