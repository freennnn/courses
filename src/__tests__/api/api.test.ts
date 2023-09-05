import fetchMock from 'jest-fetch-mock';

import { composeQueryArgs } from '../../api/api';

describe('composeQueryArgs', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
  });

  test('All arguments present', () => {
    const queryArgs = composeQueryArgs('2022', ['100', '300'], 'price', 'asc', 'test input', '25');

    expect(queryArgs.filter[0]).toBe('variants.price.centAmount:range (100 to 300)');
    expect(queryArgs.filter[1]).toBe('variants.attributes.year: 2022');
    expect(queryArgs.filter[2]).toBe('categories.id: "25"');
    expect(queryArgs.sort[0]).toBe('price asc');
    expect(queryArgs['text.en-US']).toBe('test input');
  });
});
