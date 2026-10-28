import { ScrollView, StyleSheet } from "react-native";

import { SearchForm } from "@/features/search-restaurants/ui/SearchForm";
import { theme } from "@/shared/theme";

import { Hero } from "./Hero";

export function HomePage() {
  return (
    <ScrollView style={styles.page}>
      <Hero />
      <SearchForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
});
