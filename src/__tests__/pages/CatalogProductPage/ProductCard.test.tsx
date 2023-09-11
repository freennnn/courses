import { BrowserRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import ProductCard from '../../../components/ProductCard/ProductCard';

describe('ProductCard', () => {
  it('renders properties correctly', () => {
    const product = {
      id: '1',
      name: { 'en-US': 'Product 1' },
      categories: [{ typeId: 'category' as const, id: '1' }],
      description: { 'en-US': 'Product 1 Description' },
      images: undefined,
      attributes: undefined,
      discount: 5,
      price: 100,
    };

    const price = `$${product.price / 100}`;
    const discountedPrice = `$${Number(product.price) / 100 - Number(product.discount) / 100}`;

    render(
      <BrowserRouter>
        <ProductCard product={product} />
      </BrowserRouter>,
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 1 Description')).toBeInTheDocument();
    expect(screen.getByText(price)).toBeInTheDocument();
    expect(screen.getByText(discountedPrice)).toBeInTheDocument();
  });
});
