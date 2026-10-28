import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { HomePage } from "@/pages/home/HomePage";
import { appLocale } from "@/shared/locale";

export default function HomeRoute() {
  return (
    <View
      testID="home-screen"
      accessibilityLanguage={appLocale}
      style={styles.screen}
    >
      <Stack.Screen options={{ title: "Inicio" }} />
      <HomePage />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
