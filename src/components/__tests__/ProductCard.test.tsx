import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/render';
import { Product } from '../../types/product';
import { ProductCard } from '../ProductCard';

const product: Product = {
  id: 7,
  title: 'Fjallraven Backpack',
  price: 109.95,
  description: 'Your perfect pack for everyday use.',
  category: "men's clothing",
  image: 'https://example.com/backpack.png',
  rating: { rate: 3.9, count: 120 },
};

describe('ProductCard', () => {
  it('renders title, formatted price, category, description preview and rating', async () => {
    await renderWithProviders(<ProductCard product={product} onPress={jest.fn()} />);

    expect(screen.getByText('Fjallraven Backpack')).toBeOnTheScreen();
    expect(screen.getByText('$109.95')).toBeOnTheScreen();
    expect(screen.getByText("men's clothing")).toBeOnTheScreen();
    expect(screen.getByText('Your perfect pack for everyday use.')).toBeOnTheScreen();
    expect(screen.getByText('3.9 (120)')).toBeOnTheScreen();
  });

  it('calls onPress with the product when tapped', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<ProductCard product={product} onPress={onPress} />);

    await fireEvent.press(screen.getByLabelText('Fjallraven Backpack, $109.95'));

    expect(onPress).toHaveBeenCalledWith(product);
  });
});
