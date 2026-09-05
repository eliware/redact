import { readHeaderEntries } from '../../src/headers/header-entry-reader.mjs';

test('reads object, iterable, and entry-array headers', () => {
  expect(readHeaderEntries({ a: '1' })).toEqual([['a', '1']]);
  expect(readHeaderEntries([['a', '1']])).toEqual([['a', '1']]);
  expect(readHeaderEntries(new Headers({ a: '1' }))).toEqual([['a', '1']]);
});
