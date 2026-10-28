import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const choose = (province: SearchProvince) => {
    onChange(province);
    setOpen(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Provincia</Text>
      <View style={styles.control}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={value}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen((current) => !current)}
          style={styles.select}
        >
          <Text style={styles.value}>{value}</Text>
          <Text accessible={false} importantForAccessibility="no" style={styles.chevron}>
            {open ? "▴" : "▾"}
          </Text>
        </Pressable>
        {open ? (
          <View accessibilityRole="radiogroup" accessibilityLabel="Provincia" style={styles.menu}>
            {SEARCH_PROVINCES.map((province) => {
              const selected = province === value;
              return (
                <Pressable
                  key={province}
                  accessibilityRole="radio"
                  accessibilityLabel={province}
                  accessibilityState={{ selected }}
                  onPress={() => choose(province)}
                  style={[styles.choice, selected && styles.choiceSelected]}
                >
                  <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
                    {province}
                  </Text>
                  {selected ? (
                    <Text
                      accessible={false}
                      importantForAccessibility="no"
                      style={styles.mark}
                    >
                      ✓
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
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
  control: {
    borderWidth: 2,
    borderColor: theme.color.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  select: {
    minHeight: theme.buttonMinHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    backgroundColor: theme.color.background,
    paddingHorizontal: 12,
  },
  value: {
    color: theme.color.text,
    fontSize: 16,
  },
  chevron: {
    color: theme.color.foodiesaurus,
    fontSize: 16,
  },
  menu: {
    borderRadius: 4,
    backgroundColor: theme.color.background,
    overflow: "hidden",
  },
  choice: {
    minHeight: theme.buttonMinHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  choiceSelected: {
    backgroundColor: theme.color.foodiesaurus,
  },
  choiceText: {
    color: theme.color.text,
    fontSize: 16,
  },
  choiceTextSelected: {
    color: theme.color.background,
    fontWeight: "700",
  },
  mark: {
    color: theme.color.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
