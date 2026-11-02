import { ActivityIndicator } from "react-native";

import { theme } from "@/shared/theme";

export function Loader() {
  return (
    <ActivityIndicator accessibilityLabel="Cargando" color={theme.color.foodiesaurus} />
  );
}
