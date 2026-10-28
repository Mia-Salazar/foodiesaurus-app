import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/shared/theme";

type ButtonProps = {
  label: string;
  onPress?: () => void;
};

export function Button({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: theme.buttonMinHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    paddingHorizontal: 20,
    backgroundColor: theme.color.secondary,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: theme.color.background,
    fontWeight: "700",
    fontSize: 14,
  },
});
