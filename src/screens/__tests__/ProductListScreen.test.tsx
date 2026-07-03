import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getCategories, getProducts } from '../../api/products';
import { renderWithProviders } from '../../test-utils/render';
import { Product } from '../../types/product';
import { ProductListScreenProps } from '../../navigation/types';
import { ProductListScreen } from '../ProductListScreen';

jest.mock('../../api/products');
jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
// Filter immediately on each keystroke so the test doesn't depend on timers.
jest.mock('../../hooks/useDebouncedValue', () => ({
  useDebouncedValue: <T,>(value: T) => value,
}));

const mockGetProducts = jest.mocked(getProducts);
const mockGetCategories = jest.mocked(getCategories);

const products: Product[] = [
  {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'Everyday pack',
    category: "men's clothing",
    image: 'https://example.com/1.png',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Gold Necklace',
    price: 168,
    description: 'Elegant necklace',
    category: 'jewelery',
    image: 'https://example.com/2.png',
    rating: { rate: 4.6, count: 400 },
  },
];

const navigation = { navigate: jest.fn() } as unknown as ProductListScreenProps['navigation'];
const route = { key: 'ProductList', name: 'ProductList' } as ProductListScreenProps['route'];

describe('ProductListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProducts.mockResolvedValue(products);
    mockGetCategories.mockResolvedValue(["men's clothing", 'jewelery']);
  });

  it('renders fetched products and filters them by search query', async () => {
    await renderWithProviders(<ProductListScreen navigation={navigation} route={route} />);

    await waitFor(() => expect(screen.getByText('Fjallraven Backpack')).toBeOnTheScreen());
    expect(screen.getByText('Gold Necklace')).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByLabelText('Search products by title'), 'gold');

    expect(screen.getByText('Gold Necklace')).toBeOnTheScreen();
    expect(screen.queryByText('Fjallraven Backpack')).not.toBeOnTheScreen();
  });

  it('shows an empty state when no product matches the search', async () => {
    await renderWithProviders(<ProductListScreen navigation={navigation} route={route} />);

    await waitFor(() => expect(screen.getByText('Fjallraven Backpack')).toBeOnTheScreen());

    await fireEvent.changeText(screen.getByLabelText('Search products by title'), 'spaceship');

    expect(screen.getByText('No matching products')).toBeOnTheScreen();
  });

  it('shows an error state with retry when the request fails, then recovers', async () => {
    mockGetProducts.mockRejectedValueOnce(new Error('Network request failed'));

    await renderWithProviders(<ProductListScreen navigation={navigation} route={route} />);

    await waitFor(() => expect(screen.getByText('Unable to load')).toBeOnTheScreen());

    await fireEvent.press(screen.getByLabelText('Retry loading products'));

    await waitFor(() => expect(screen.getByText('Fjallraven Backpack')).toBeOnTheScreen());
  });

  it('navigates to details when a product card is pressed', async () => {
    await renderWithProviders(<ProductListScreen navigation={navigation} route={route} />);

    await waitFor(() => expect(screen.getByText('Fjallraven Backpack')).toBeOnTheScreen());

    await fireEvent.press(screen.getByLabelText('Fjallraven Backpack, $109.95'));

    expect(navigation.navigate).toHaveBeenCalledWith('ProductDetails', { productId: 1 });
  });
});
