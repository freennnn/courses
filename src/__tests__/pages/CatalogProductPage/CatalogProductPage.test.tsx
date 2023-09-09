import { BrowserRouter } from 'react-router-dom';

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import CatalogProductPage from 'pages/CatalogProductPage/CatalogProductPage';

const getProductsListMock = jest.fn();
jest.mock('pages/CatalogProductPage/helpers.ts', () => {
  const originalModule = jest.requireActual<typeof import('pages/CatalogProductPage/helpers.ts')>(
    'pages/CatalogProductPage/helpers.ts',
  );

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getProductsList: getProductsListMock,
  };
});

describe('CatalogProductPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
  });

  it('filters products based on selectedYear', () => {
    render(
      <BrowserRouter>
        <CatalogProductPage />
      </BrowserRouter>,
    );

    // Simulate selecting a year from a dropdown, e.g., "2023"
    const yearDropdown = screen.getByLabelText('Year:'); // Adjust the selector as needed
    fireEvent.change(yearDropdown, { target: { value: '2023' } });

    expect(getProductsListMock.mock.calls.length).toBe(1);
  });
});
