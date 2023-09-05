import ProductList from '@/features/ProductList/ProductList';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/ProductCard/ProductCard', () => ({
  __esModule: true,
  ProductCard: jest.fn(() => <>test</>),
}));

describe('CatalogProductPage', () => {
  it('renders products when productList is not empty', () => {
    // Mock the productList with sample data
    const productList = [
      {
        id: '1',
        name: { 'en-US': 'Product 1' },
        categories: [{ typeId: 'category' as const, id: '1' }],
        description: undefined,
        images: undefined,
        attributes: undefined,
        discount: 5,
        price: 100,
      },
    ];

    render(<ProductList productList={productList} />);

    // Wait for the component to load (if necessary)

    // Assert that the product names are visible in the rendered component
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});
