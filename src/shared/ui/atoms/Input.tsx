import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "@/shared/theme";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  help: string;
  maxLength: number;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  help,
  maxLength,
}: InputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5c5c5c"
        maxLength={maxLength}
        style={styles.input}
      />
      <Text style={styles.help}>{help}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  label: {
    color: theme.color.background,
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    minHeight: theme.buttonMinHeight,
    borderRadius: 4,
    backgroundColor: theme.color.background,
    color: theme.color.text,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  help: {
    color: theme.color.background,
    fontSize: 14,
  },
});
