import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { appLocale } from "@/locale";
import { theme } from "@/theme";

export default function HomeScreen() {
  return (
    <View
      testID="home-screen"
      accessibilityLanguage={appLocale}
      style={styles.screen}
    >
      <Stack.Screen options={{ title: "Inicio" }} />
      <Text style={styles.text}>Inicio</Text>
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
