import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ProductRating } from '../types/product';

interface RatingStarsProps {
  rating: ProductRating;
  size?: number;
}

const MAX_STARS = 5;

export function RatingStars({ rating, size = 13 }: RatingStarsProps) {
  const { colors, typography } = useTheme();
  const rounded = Math.round(rating.rate);

  return (
    <View
      style={styles.row}
      accessibilityLabel={`Rated ${rating.rate} out of 5 from ${rating.count} reviews`}
    >
      <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: MAX_STARS }, (_, index) => (
          <Ionicons
            key={index}
            name={index < rounded ? 'star' : 'star-outline'}
            size={size}
            color={colors.text}
          />
        ))}
      </View>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>
        {rating.rate.toFixed(1)} ({rating.count})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
