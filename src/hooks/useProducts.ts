import { useQuery } from '@tanstack/react-query';
import { getCategories, getProduct, getProducts } from '../api/products';

export const productKeys = {
  all: ['products'] as const,
  detail: (id: number) => ['products', id] as const,
  categories: ['categories'] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: getCategories,
  });
}
