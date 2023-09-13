import { BrowserRouter } from 'react-router-dom';

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import CatalogProductPage from '../../../pages/CatalogProductPage/CatalogProductPage';
import * as helpers from '../../../pages/CatalogProductPage/helpers';

jest.mock('../../../features/CategoryList/CategoryList.tsx', () => 'CategoryList');

const mockResponse = [
  {
    id: 'test',
    name: {
      name: 'Name',
    },
    categories: [],
    description: undefined,
    images: undefined,
    attributes: undefined,
    discount: 0,
    price: 10,
  },
];

const mock = jest.spyOn(helpers, 'getProductsList'); // spy on the default export of config

describe('CatalogProductPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  it('filters products based on selectedYear, sorts products by name, searches products by word', async () => {
    mock.mockImplementation(() => Promise.resolve(mockResponse));

    const r = render(
      <BrowserRouter>
        <CatalogProductPage />
      </BrowserRouter>,
    );

    const yearDropdown = await r.findByTestId('filter-year');
    const sortingSelectName = await r.findByTestId('sorting-select-name');
    const searchInput = await r.findByTestId('search-input');
    const searchForm = r.getByTestId('search-form');

    act(() => {
      // Simulate selecting a year from a dropdown: "2023"
      fireEvent.change(yearDropdown, { target: { value: '2023' } });
      // Simulate selecting a name order from a dropdown: "A-Z"
      fireEvent.change(sortingSelectName, { target: { value: 'asc' } });
      // Simulate search a word: "movie"
      fireEvent.change(searchInput, { target: { value: 'movie' } });
      fireEvent.submit(searchForm);
    });

    expect(mock).toHaveBeenCalledWith('', [], '', '', '', '');
    expect(mock).toHaveBeenCalledWith('2023', [], '', '', '', '');
    expect(mock).toHaveBeenCalledWith('2023', [], 'name', 'asc', '', '');
    expect(mock).toHaveBeenCalledWith('2023', [], 'name', 'asc', 'movie', '');
    expect(mock.mock.calls.length).toBe(4);
  });
});
