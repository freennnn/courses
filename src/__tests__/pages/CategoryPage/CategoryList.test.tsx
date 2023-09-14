import { BrowserRouter } from 'react-router-dom';

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import CategoryList from '../../../features/CategoryList/CategoryList';
import * as helpers from '../../../pages/CatalogProductPage/helpers';

const mockResponse = [
  {
    id: '1',
    name: { 'en-US': 'test_name_1' },
    url: { 'en-US': 'test_url_1' },
    ancestors: [],
    parent: undefined,
  },
  {
    id: '2',
    name: { 'en-US': 'test_name_2' },
    url: { 'en-US': 'test_url_2' },
    ancestors: [],
    parent: undefined,
  },
];

const mock = jest.spyOn(helpers, 'getCategoryList'); // spy on the default export of config

describe('CategoryList', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  it('renders the list of categories', async () => {
    // Mock the data fetching function
    mock.mockImplementation(() => Promise.resolve(mockResponse));

    const r = render(
      <BrowserRouter>
        <CategoryList newId='' handleActiveCategory={jest.fn()} />
      </BrowserRouter>,
    );

    const categoryLink1 = await r.findByText('test_name_1');
    expect(categoryLink1).toBeInTheDocument();
    const categoryLink2 = await r.findByText('test_name_2');
    expect(categoryLink2).toBeInTheDocument();
  });
});
