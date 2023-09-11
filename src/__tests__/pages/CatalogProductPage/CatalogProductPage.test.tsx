/* eslint no-var: off */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BrowserRouter } from 'react-router-dom';

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import CatalogProductPage from 'pages/CatalogProductPage/CatalogProductPage';

//https://github.com/sodatea/vite-jest/tree/main/packages/vite-jest#limitations-and-differences-with-commonjs-tests

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var getProductsListMock;

jest.mock('pages/CatalogProductPage/helpers.ts', () => {
  getProductsListMock = jest.fn(() => Promise.resolve());
  return {
    getProductsList: getProductsListMock,
  };
});

jest.mock('features/CategoryList/CategoryList', () => () => 'CategoryList');

describe('CatalogProductPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
  });

  it('filters products based on selectedYear', () => {
    act(() => {
      render(
        <BrowserRouter>
          <CatalogProductPage />
        </BrowserRouter>,
      );
    });

    act(() => {
      // Simulate selecting a year from a dropdown, e.g., "2023"
      const yearDropdown = screen.getByLabelText('Year:'); // Adjust the selector as needed
      fireEvent.change(yearDropdown, { target: { value: '2023' } });
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getProductsListMock.mock.calls.length).toBe(2);
  });
});
