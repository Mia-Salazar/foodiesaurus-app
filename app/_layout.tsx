import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { appLocale } from "@/locale";
import { theme } from "@/theme";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }} accessibilityLanguage={appLocale}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.color.background },
          headerTintColor: theme.color.text,
          contentStyle: { backgroundColor: theme.color.background },
        }}
      />
    </View>
  );
}
