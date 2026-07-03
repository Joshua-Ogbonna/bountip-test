import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = 'Something went wrong while loading products.',
  onRetry,
}: ErrorStateProps) {
  const { colors, spacing, radii, typography } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.md, padding: spacing.xl }]}>
      <Ionicons name="cloud-offline-outline" size={44} color={colors.textSecondary} />
      <Text style={[typography.title, styles.centered, { color: colors.text }]}>
        Unable to load
      </Text>
      <Text style={[typography.body, styles.centered, { color: colors.textSecondary }]}>
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading products"
        style={({ pressed }) => [
          styles.retryButton,
          { backgroundColor: colors.accent, borderRadius: radii.pill, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[typography.body, { color: colors.onAccent, fontWeight: '600' }]}>
          Try again
        </Text>
      </Pressable>
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
  retryButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 4,
  },
});
