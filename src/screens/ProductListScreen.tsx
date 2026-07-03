import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryTabs } from '../components/CategoryTabs';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ProductCard } from '../components/ProductCard';
import { ProductListSkeleton } from '../components/ProductListSkeleton';
import { SearchBar } from '../components/SearchBar';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useCategories, useProducts } from '../hooks/useProducts';
import { ALL_CATEGORIES, filterProducts } from '../lib/filterProducts';
import { useTheme } from '../theme/ThemeContext';
import { Product } from '../types/product';
import { ProductListScreenProps } from '../navigation/types';

const NUM_COLUMNS = 2;

export function ProductListScreen({ navigation }: ProductListScreenProps) {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const debouncedQuery = useDebouncedValue(query);

  const products = useProducts();
  const categories = useCategories();

  const visibleProducts = useMemo(
    () => filterProducts(products.data ?? [], { query: debouncedQuery, category }),
    [products.data, debouncedQuery, category],
  );

  const openDetails = useCallback(
    (product: Product) => navigation.navigate('ProductDetails', { productId: product.id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} onPress={openDetails} />,
    [openDetails],
  );

  const isInitialLoading = products.isPending;
  const hasError = products.isError && !products.data;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: spacing.md }}>
        <Text style={[typography.display, { color: colors.text, marginTop: spacing.md }]}>
          Catalogue
        </Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <CategoryTabs
        categories={categories.data ?? []}
        selected={category}
        onSelect={setCategory}
      />

      {isInitialLoading ? (
        <ProductListSkeleton />
      ) : hasError ? (
        <ErrorState
          message={products.error instanceof Error ? products.error.message : undefined}
          onRetry={() => products.refetch()}
        />
      ) : (
        <FlatList
          style={styles.list}
          data={visibleProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{
            padding: spacing.lg,
            gap: spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <EmptyState
              title={debouncedQuery ? 'No matching products' : 'No products found'}
              message={
                debouncedQuery
                  ? `Nothing matches “${debouncedQuery.trim()}”. Try a different search term.`
                  : 'Pull down to refresh the catalogue.'
              }
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={products.isRefetching}
              onRefresh={() => products.refetch()}
              tintColor={colors.textSecondary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});
