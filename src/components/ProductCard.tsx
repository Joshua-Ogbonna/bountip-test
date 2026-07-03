import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../lib/format';
import { useTheme } from '../theme/ThemeContext';
import { Product } from '../types/product';
import { FavoriteButton } from './FavoriteButton';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard = memo(function ProductCard({ product, onPress }: ProductCardProps) {
  const { colors, spacing, radii, typography } = useTheme();

  // The favourite button is a sibling of the pressable area (overlaid on top),
  // not a child, so we never nest one pressable inside another. Nested
  // pressables render invalid nested <button> elements on web and make touch
  // handling ambiguous on native.
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
      <Pressable
        onPress={() => onPress(product)}
        accessibilityRole="button"
        accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
        style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={[styles.imageWrapper, { borderRadius: radii.md, backgroundColor: '#FFFFFF' }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={{ gap: spacing.xs, padding: spacing.md }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
            {product.category}
          </Text>
          <Text style={[typography.cardTitle, { color: colors.text }]} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={2}>
            {product.description}
          </Text>
          {product.rating ? <RatingStars rating={product.rating} /> : null}
          <Text style={[typography.price, { color: colors.text }]}>{formatPrice(product.price)}</Text>
        </View>
      </Pressable>

      <View style={styles.favorite}>
        <FavoriteButton productId={product.id} size={16} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
  },
  imageWrapper: {
    margin: 8,
    marginBottom: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  favorite: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});
