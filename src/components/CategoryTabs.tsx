import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ALL_CATEGORIES } from '../lib/filterProducts';
import { capitalize } from '../lib/format';
import { useTheme } from '../theme/ThemeContext';

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  const { colors, spacing, radii, typography } = useTheme();
  const options = [ALL_CATEGORIES, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={[styles.container, { gap: spacing.sm, paddingHorizontal: spacing.lg }]}
      accessibilityRole="tablist"
    >
      {options.map((category) => {
        const isSelected = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: isSelected ? colors.accent : colors.surfaceMuted,
                borderRadius: radii.pill,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: isSelected ? colors.onAccent : colors.text },
              ]}
            >
              {category === ALL_CATEGORIES ? 'All' : capitalize(category)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});
