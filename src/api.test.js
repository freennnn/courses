import Loader from './api.ts';
import {jest} from '@jest/globals';


test('loader base url hase commerce tools domain', () => {
  expect((new Loader()).baseLink.includes('commercetools.com')).toBe(true);
});

test('loader default options are empty object', () => {
  expect(Object.keys((new Loader()).options).length === 0).toBe(true);
});

test('loader custom baseLink persistence', () => {
  expect((new Loader('customLink')).baseLink === 'customLink').toBe(true);
});