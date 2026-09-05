import { readSafeEntries } from '../../src/inspection/read-safe-entries.mjs';

test('reads entries defensively', () => {
  expect(readSafeEntries({ a: 1 })).toEqual([['a', 1]]);
  expect(readSafeEntries(new Proxy({}, { ownKeys() { throw new Error('blocked'); } }))).toEqual([]);
});
