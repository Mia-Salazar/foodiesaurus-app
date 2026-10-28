import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  SEARCH_PROVINCES,
  SearchProvince,
} from "@/entities/restaurant/restaurant.constants";
import { theme } from "@/shared/theme";

type ProvinceFieldProps = {
  value: string;
  onChange: (province: SearchProvince) => void;
};

export function ProvinceField({ value, onChange }: ProvinceFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Provincia</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Provincia">
        {SEARCH_PROVINCES.map((province) => {
          const selected = province === value;
          return (
            <Pressable
              key={province}
              accessibilityRole="radio"
              accessibilityLabel={province}
              accessibilityState={{ selected }}
              onPress={() => onChange(province)}
              style={styles.choice}
            >
              <Text style={[styles.choiceText, selected && styles.choiceSelected]}>
                {province}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.help}>
        Elige la zona. Ahora hay Madrid, Barcelona y Sevilla.
      </Text>
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
  help: {
    color: theme.color.background,
    fontSize: 14,
  },
  choice: {
    minHeight: theme.buttonMinHeight,
    justifyContent: "center",
  },
  choiceText: {
    color: theme.color.background,
    fontSize: 16,
  },
  choiceSelected: {
    fontWeight: "700",
  },
});
