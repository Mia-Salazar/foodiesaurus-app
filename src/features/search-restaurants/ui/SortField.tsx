import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

import {
  RESTAURANT_SORT_OPTIONS,
  RestaurantSort,
  restaurantSort,
} from "../lib/sortRestaurants";

type SortFieldProps = {
  value: RestaurantSort;
  onChange: (sort: RestaurantSort) => void;
};

export function SortField({ value, onChange }: SortFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Ordenar</Text>
      <Picker
        accessibilityLabel="Ordenar"
        selectedValue={value}
        onValueChange={(next) => {
          if (typeof next === "string") {
            onChange(restaurantSort(next));
          }
        }}
        mode="dropdown"
        itemStyle={styles.item}
      >
        {RESTAURANT_SORT_OPTIONS.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            color={theme.color.text}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  label: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: "700",
  },
  item: {
    color: theme.color.text,
    fontSize: 16,
  },
});
