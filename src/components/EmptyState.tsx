import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'No products found',
  message = 'Try a different search term or category.',
}: EmptyStateProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.md, padding: spacing.xl }]}>
      <Ionicons name="search-outline" size={44} color={colors.textSecondary} />
      <Text style={[typography.title, styles.centered, { color: colors.text }]}>{title}</Text>
      <Text style={[typography.body, styles.centered, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
