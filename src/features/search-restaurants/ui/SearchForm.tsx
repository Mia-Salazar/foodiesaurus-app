import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  DEFAULT_SEARCH_PROVINCE,
  SEARCH_PROVINCES,
  SearchProvince,
} from "@/entities/restaurant/restaurant.constants";
import { Button } from "@/shared/ui/atoms/Button";
import { Input } from "@/shared/ui/atoms/Input";
import { theme } from "@/shared/theme";

type SearchFormProps = {
  initialProvince?: string;
  initialTerm?: string;
};

export function SearchForm({
  initialProvince = DEFAULT_SEARCH_PROVINCE,
  initialTerm = "",
}: SearchFormProps) {
  const [province, setProvince] = useState<string>(initialProvince);
  const [term, setTerm] = useState(initialTerm);

  return (
    <View style={styles.band}>
      <Text accessibilityRole="header" style={styles.title}>
        Busca un restaurante
      </Text>
      <Input
        label="Nombre"
        value={term}
        onChangeText={setTerm}
        placeholder="Ejemplo: Friki Pizza"
        maxLength={40}
        help="Nombre del restaurante. Si no lo sabes, déjalo vacío."
      />
      <Text style={styles.label}>Provincia</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Provincia">
        {SEARCH_PROVINCES.map((item) => (
          <ProvinceChoice
            key={item}
            province={item}
            selected={item === province}
            onSelect={setProvince}
          />
        ))}
      </View>
      <Text style={styles.help}>
        Elige la zona. Ahora hay Madrid, Barcelona y Sevilla.
      </Text>
      <Button label="Buscar" />
    </View>
  );
}

function ProvinceChoice({
  province,
  selected,
  onSelect,
}: {
  province: SearchProvince;
  selected: boolean;
  onSelect: (province: SearchProvince) => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={province}
      accessibilityState={{ selected }}
      onPress={() => onSelect(province)}
      style={styles.choice}
    >
      <Text style={[styles.choiceText, selected && styles.choiceSelected]}>
        {province}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: theme.color.foodiesaurus,
    paddingHorizontal: 16,
    paddingVertical: 40,
    gap: 12,
  },
  title: {
    color: theme.color.background,
    fontFamily: theme.font.brand,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
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
