import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  DEFAULT_SEARCH_PROVINCE,
  SearchProvince,
} from "@/entities/restaurant/restaurant.constants";
import { theme } from "@/shared/theme";
import { Button } from "@/shared/ui/atoms/Button";
import { Input } from "@/shared/ui/atoms/Input";

import { ProvinceField } from "./ProvinceField";

type SearchFormProps = {
  initialProvince?: string;
  initialTerm?: string;
};

export function SearchForm({
  initialProvince = DEFAULT_SEARCH_PROVINCE,
  initialTerm = "",
}: SearchFormProps) {
  const [province, setProvince] = useState(initialProvince);
  const [term, setTerm] = useState(initialTerm);

  const search = () => {
    const trimmed = term.trim();
    router.push({
      pathname: "/restaurants",
      params: trimmed ? { province, term: trimmed } : { province },
    });
  };

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
      <ProvinceField
        value={province}
        onChange={(next: SearchProvince) => setProvince(next)}
      />
      <Button label="Buscar" onPress={search} />
    </View>
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
});
