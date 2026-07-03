import { Product } from '../types/product';

export const ALL_CATEGORIES = 'all';

export interface ProductFilter {
  query: string;
  category: string;
}

/**
 * Pure search + category filtering, kept out of components so it is
 * trivially unit-testable and reusable.
 */
export function filterProducts(products: Product[], { query, category }: ProductFilter): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = category === ALL_CATEGORIES || product.category === category;
    const matchesQuery =
      normalizedQuery.length === 0 || product.title.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}
