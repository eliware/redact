import { readObjectEntries } from '../../src/structured/object-entry-reader.mjs';

test('reads safe enumerable entries and skips throwing getters', () => {
  const value = { safe: 1 };
  Object.defineProperty(value, 'bad', { enumerable: true, get() { throw new Error('blocked'); } });
  expect(readObjectEntries(value)).toEqual([['safe', 1]]);
});
