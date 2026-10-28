import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { appLocale } from "@/locale";
import { theme } from "@/theme";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View
      testID="detail-screen"
      accessibilityLanguage={appLocale}
      style={styles.screen}
    >
      <Stack.Screen options={{ title: "Restaurante" }} />
      <Text style={styles.text}>{id}</Text>
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
