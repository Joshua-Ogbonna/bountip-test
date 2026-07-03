import { Product } from '../../types/product';
import { ALL_CATEGORIES, filterProducts } from '../filterProducts';

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: 1,
  title: 'Plain Tee',
  price: 10,
  description: 'A t-shirt',
  category: "men's clothing",
  image: 'https://example.com/img.png',
  rating: { rate: 4, count: 100 },
  ...overrides,
});

const products: Product[] = [
  makeProduct({ id: 1, title: 'Fjallraven Backpack', category: "men's clothing" }),
  makeProduct({ id: 2, title: 'Gold Ring', category: 'jewelery' }),
  makeProduct({ id: 3, title: 'Golden Necklace', category: 'jewelery' }),
  makeProduct({ id: 4, title: 'SSD Drive', category: 'electronics' }),
];

describe('filterProducts', () => {
  it('returns everything for an empty query and the "all" category', () => {
    expect(filterProducts(products, { query: '', category: ALL_CATEGORIES })).toHaveLength(4);
  });

  it('matches titles case-insensitively and ignores surrounding whitespace', () => {
    const result = filterProducts(products, { query: '  GOLD ', category: ALL_CATEGORIES });
    expect(result.map((p) => p.id)).toEqual([2, 3]);
  });

  it('filters by category', () => {
    const result = filterProducts(products, { query: '', category: 'jewelery' });
    expect(result.map((p) => p.id)).toEqual([2, 3]);
  });

  it('combines search and category filters', () => {
    const result = filterProducts(products, { query: 'necklace', category: 'jewelery' });
    expect(result.map((p) => p.id)).toEqual([3]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterProducts(products, { query: 'gold', category: 'electronics' })).toEqual([]);
  });
});
