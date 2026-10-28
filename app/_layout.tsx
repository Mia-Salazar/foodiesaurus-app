import { Teko_600SemiBold, Teko_700Bold, useFonts } from "@expo-google-fonts/teko";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { appLocale } from "@/shared/locale";
import { theme } from "@/shared/theme";

export default function RootLayout() {
  useFonts({
    Teko_600SemiBold,
    Teko_700Bold,
  });

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
