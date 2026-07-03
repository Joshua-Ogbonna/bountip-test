import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

function SkeletonCard({ opacity }: { opacity: Animated.Value }) {
  const { colors, spacing, radii } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
      <Animated.View
        style={[styles.image, { backgroundColor: colors.skeleton, borderRadius: radii.md, opacity }]}
      />
      <View style={{ gap: spacing.sm, padding: spacing.md }}>
        <Animated.View
          style={[styles.line, { backgroundColor: colors.skeleton, width: '50%', opacity }]}
        />
        <Animated.View style={[styles.line, { backgroundColor: colors.skeleton, opacity }]} />
        <Animated.View
          style={[styles.line, { backgroundColor: colors.skeleton, width: '35%', opacity }]}
        />
      </View>
    </View>
  );
}

const SKELETON_COUNT = 6;

/** Pulsing placeholder grid shown during the initial catalogue load. */
export function ProductListSkeleton() {
  const { spacing } = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View
      style={[styles.grid, { padding: spacing.lg, gap: spacing.md }]}
      accessibilityLabel="Loading products"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <SkeletonCard key={index} opacity={opacity} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '47%',
    flexGrow: 1,
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 1,
    margin: 8,
    marginBottom: 0,
  },
  line: {
    height: 12,
    borderRadius: 6,
    width: '80%',
  },
});
