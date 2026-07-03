import { useQueryClient } from '@tanstack/react-query';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../components/ErrorState';
import { FavoriteButton } from '../components/FavoriteButton';
import { RatingStars } from '../components/RatingStars';
import { productKeys, useProduct } from '../hooks/useProducts';
import { capitalize, formatPrice } from '../lib/format';
import { ProductDetailsScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { Product } from '../types/product';

export function ProductDetailsScreen({ route }: ProductDetailsScreenProps) {
  const { productId } = route.params;
  const { colors, spacing, radii, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Seed from the already-fetched list so the screen renders instantly,
  // while the detail query refreshes in the background.
  const cachedProduct = queryClient
    .getQueryData<Product[]>(productKeys.all)
    ?.find((item) => item.id === productId);

  const { data, isPending, isError, refetch } = useProduct(productId);
  const product = data ?? cachedProduct;

  if (!product) {
    return isError || !isPending ? (
      <ErrorState message="We couldn't load this product." onRetry={() => refetch()} />
    ) : (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>Loading product…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.imageCard, { backgroundColor: '#FFFFFF', borderRadius: radii.xl }]}
        >
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            accessibilityLabel={`Image of ${product.title}`}
            accessibilityIgnoresInvertColors
          />
          <View style={styles.favorite}>
            <FavoriteButton productId={product.id} />
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: colors.surfaceMuted, borderRadius: radii.pill },
            ]}
          >
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {capitalize(product.category)}
            </Text>
          </View>
          <Text style={[typography.display, { color: colors.text }]}>{product.title}</Text>
          {product.rating ? <RatingStars rating={product.rating} size={15} /> : null}
        </View>

        <Text style={[typography.body, { color: colors.textSecondary }]}>
          {product.description}
        </Text>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + spacing.md,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            gap: spacing.lg,
          },
        ]}
      >
        <View>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Price</Text>
          <Text style={[typography.title, { color: colors.text }]}>
            {formatPrice(product.price)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Buy ${product.title} for ${formatPrice(product.price)}`}
          style={({ pressed }) => [
            styles.buyButton,
            { backgroundColor: colors.accent, borderRadius: radii.pill, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[typography.body, { color: colors.onAccent, fontWeight: '600' }]}>
            Buy Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCard: {
    overflow: 'hidden',
    padding: 24,
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
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyButton: {
    flex: 1,
    maxWidth: 220,
    alignItems: 'center',
    paddingVertical: 16,
  },
});
