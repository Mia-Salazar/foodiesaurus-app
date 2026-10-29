import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ResultsPage } from "@/pages/restaurants/ResultsPage";
import { appLocale } from "@/shared/locale";

export default function ResultsRoute() {
  return (
    <View
      testID="results-screen"
      accessibilityLanguage={appLocale}
      style={styles.screen}
    >
      <Stack.Screen options={{ title: "Restaurantes" }} />
      <ResultsPage />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
