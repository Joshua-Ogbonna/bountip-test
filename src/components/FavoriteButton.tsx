import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useFavoritesStore } from '../store/favoritesStore';
import { useTheme } from '../theme/ThemeContext';

interface FavoriteButtonProps {
  productId: number;
  size?: number;
}

export function FavoriteButton({ productId, size = 20 }: FavoriteButtonProps) {
  const { colors, radii } = useTheme();
  const isFavorite = useFavoritesStore((state) => state.ids.includes(productId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <Pressable
      onPress={() => toggleFavorite(productId)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: isFavorite }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.background, borderRadius: radii.pill, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite ? colors.danger : colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
