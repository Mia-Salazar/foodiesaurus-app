import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { RestaurantDetailPage } from "@/pages/restaurants/RestaurantDetailPage";
import { appLocale } from "@/shared/locale";

export default function DetailRoute() {
  return (
    <View
      testID="detail-screen"
      accessibilityLanguage={appLocale}
      style={styles.screen}
    >
      <Stack.Screen options={{ title: "Restaurante" }} />
      <RestaurantDetailPage />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
