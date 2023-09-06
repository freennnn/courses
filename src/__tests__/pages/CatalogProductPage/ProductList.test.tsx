import { BrowserRouter } from 'react-router-dom';

import ProductList from '@/features/ProductList/ProductList';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('ProductList', () => {
  it('renders products when productList is not empty', () => {
    const productList = [
      {
        id: '1',
        name: { 'en-US': 'Product 1' },
        categories: [{ typeId: 'category' as const, id: '1' }],
        description: { 'en-US': 'Product 1 Description' },
        images: undefined,
        attributes: undefined,
        discount: 5,
        price: 100,
      },
      {
        id: '2',
        name: { 'en-US': 'Product 2' },
        categories: [{ typeId: 'category' as const, id: '1' }],
        description: { 'en-US': 'Product 2 Description' },
        images: undefined,
        attributes: undefined,
        discount: 5,
        price: 100,
      },
    ];

    render(
      <BrowserRouter>
        <ProductList productList={productList} />
      </BrowserRouter>,
    );

    const productCards = screen.getAllByTestId('product-card');
    expect(productCards.length).toBe(productList.length);
  });
});
