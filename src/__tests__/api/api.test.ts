import fetchMock from 'jest-fetch-mock';

import { composeQueryArgs } from '../../api/api';

describe('composeQueryArgs', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
  });

  test('All arguments present', () => {
    const year = '2022';
    const priceRange = ['100', '300'];
    const sortBy = 'price';
    const sortOrder = 'asc';
    const searchInput = 'test input';
    const categoryId = '25';
    const itemsLimit = 3;
    const offset = 0;

    const queryArgs = composeQueryArgs(
      year,
      priceRange,
      sortBy,
      sortOrder,
      searchInput,
      categoryId,
      itemsLimit,
      offset,
    );

    expect(queryArgs).toEqual({
      filter: [
        'variants.price.centAmount:range (100 to 300)',
        'variants.attributes.year: 2022',
        'categories.id: "25"',
      ],
      sort: ['price asc'],
      'text.en-US': 'test input',
      limit: 3,
      offset: 0,
    });
  });
});
