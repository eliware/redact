import { readSafeEntries } from '../../src/inspection/read-safe-entries.mjs';

test('reads entries defensively', () => {
  expect(readSafeEntries({ a: 1 })).toEqual([['a', 1]]);
  expect(readSafeEntries(new Proxy({}, { ownKeys() { throw new Error('blocked'); } }))).toEqual([]);
});

test('omits accessor properties without invoking them', () => {
  let invoked = false;
  const value = {};
  Object.defineProperty(value, 'secret', { enumerable: true, get() { invoked = true; return 'value'; } });
  expect(readSafeEntries(value)).toEqual([]);
  expect(invoked).toBe(false);
});

test('omits properties whose descriptor lookup throws', () => {
  const value = new Proxy({ secret: 'value' }, { getOwnPropertyDescriptor() { throw new Error('blocked'); } });
  expect(readSafeEntries(value)).toEqual([]);
});
